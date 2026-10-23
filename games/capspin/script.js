(function () {
  var form = document.getElementById("registration-form");
  if (!form) return;

  var division = document.getElementById("division");
  var teamFields = document.getElementById("team-fields");
  var teamName = document.getElementById("team-name");
  var captainName = document.getElementById("captain-name");
  var success = document.getElementById("success");
  var error = document.getElementById("error");
  var STORAGE_KEY = "capspinSeasonEntriesV1";
  var USERS_KEY = "capspinUsersV1";
  var CURRENT_SEASON = "Season-1";
  var RESERVED_ADMIN = "uncapped";

  function toggleTeamFields() {
    var isTeam = division.value === "Team Competitor";
    teamFields.style.display = isTeam ? "grid" : "none";
    teamName.required = isTeam;
    captainName.required = isTeam;
  }

  function showError(message) {
    error.textContent = message;
    error.className = "notice warn show";
    success.className = "notice ok";
  }

  function showSuccess() {
    success.className = "notice ok show";
    error.className = "notice warn";
    error.textContent = "";
  }

  function loadEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_e) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function loadUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  division.addEventListener("change", toggleTeamFields);
  toggleTeamFields();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      showError("Please complete every required field before submitting.");
      return;
    }

    var data = new FormData(form);
    var username = String(data.get("username") || "").trim();
    var password = String(data.get("password") || "").trim();
    var fullName = String(data.get("fullName") || "").trim();
    var gradeLevel = String(data.get("gradeLevel") || "");
    var campus = String(data.get("campus") || "");
    var divisionValue = String(data.get("division") || "");
    var teamNameValue = String(data.get("teamName") || "").trim();
    var usernameLower = normalize(username);

    if (usernameLower === RESERVED_ADMIN) {
      showError('The username "uncapped" is reserved for admin.');
      return;
    }

    var users = loadUsers();
    var usernameExists = users.some(function (user) {
      return normalize(user.username) === usernameLower;
    });
    if (usernameExists) {
      showError("That username is already taken. Choose another username.");
      return;
    }

    var entries = loadEntries();
    var key = (fullName + "|" + gradeLevel).toLowerCase();
    var existing = entries.find(function (entry) {
      return entry.key === key && entry.season === CURRENT_SEASON;
    });

    if (existing && existing.campus !== campus) {
      showError(
        "Campus Lock Rule: this student is already registered at " +
          existing.campus +
          " for this season."
      );
      return;
    }

    if (existing) {
      showError("Duplicate registration blocked for this season.");
      return;
    }

    entries.push({
      key: key,
      season: CURRENT_SEASON,
      fullName: fullName,
      gradeLevel: gradeLevel,
      campus: campus,
      division: divisionValue,
      teamName: teamNameValue,
      captainName: String(data.get("captainName") || "").trim(),
      slot: String(data.get("slot") || "")
    });
    saveEntries(entries);

    users.push({
      username: username,
      password: password,
      role: "player",
      teamName: teamNameValue || fullName + " Solo"
    });
    saveUsers(users);

    showSuccess();
    form.reset();
    toggleTeamFields();
  });
})();
