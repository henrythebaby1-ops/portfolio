(function () {
  var USERS_KEY = "capspinUsersV1";
  var SESSION_KEY = "capspinSessionV1";
  var EVENTS_KEY = "capspinEventsV1";
  var UNCAPPED_NAME = "uncapped";

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function ensureAdminUser() {
    var users = loadJson(USERS_KEY, []);
    var hasUncapped = users.some(function (user) {
      return normalize(user.username) === UNCAPPED_NAME;
    });

    if (!hasUncapped) {
      users.push({
        username: "uncapped",
        password: "uncapped",
        role: "admin",
        teamName: "Uncapped Admin"
      });
      saveJson(USERS_KEY, users);
    }
  }

  function getUsers() {
    ensureAdminUser();
    return loadJson(USERS_KEY, []);
  }

  function findUser(username) {
    var users = getUsers();
    var name = normalize(username);
    return (
      users.find(function (user) {
        return normalize(user.username) === name;
      }) || null
    );
  }

  function getSession() {
    return loadJson(SESSION_KEY, null);
  }

  function getCurrentUser() {
    var session = getSession();
    if (!session || !session.username) return null;
    return findUser(session.username);
  }

  function setSession(username) {
    saveJson(SESSION_KEY, { username: username });
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getEvents() {
    return loadJson(EVENTS_KEY, []);
  }

  function saveEvents(events) {
    saveJson(EVENTS_KEY, events);
  }

  function showMessage(id, text, kind) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = "notice " + (kind || "ok") + " show";
  }

  function hideMessage(id, baseClass) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = "";
    el.className = baseClass || "notice";
  }

  function initLoginPage() {
    var loginForm = document.getElementById("login-form");
    var signupForm = document.getElementById("signup-form");
    if (!loginForm && !signupForm) return;

    var current = getCurrentUser();
    if (current) {
      var status = document.getElementById("account-status");
      if (status) {
        status.textContent =
          "Logged in as " + current.username + " (" + current.role + ").";
      }
    }

    var logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        window.location.reload();
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage("login-error", "notice warn");
        hideMessage("login-success", "notice ok");

        if (!signupForm.checkValidity()) {
          showMessage("login-error", "Fill all required sign-up fields.", "warn");
          return;
        }

        var data = new FormData(signupForm);
        var username = String(data.get("signupUsername") || "").trim();
        var password = String(data.get("signupPassword") || "").trim();
        var teamName = String(data.get("signupTeamName") || "").trim();
        var nameLower = normalize(username);

        if (!username || !password) {
          showMessage("login-error", "Username and password are required.", "warn");
          return;
        }

        if (findUser(username)) {
          showMessage("login-error", "That username is already taken.", "warn");
          return;
        }

        var role = nameLower === UNCAPPED_NAME ? "admin" : "player";
        var users = getUsers();
        users.push({
          username: username,
          password: password,
          role: role,
          teamName: teamName || username + " Solo"
        });
        saveJson(USERS_KEY, users);
        setSession(username);
        showMessage(
          "login-success",
          "Account created. Registration is free and active instantly.",
          "ok"
        );
        signupForm.reset();
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage("login-error", "notice warn");
        hideMessage("login-success", "notice ok");

        if (!loginForm.checkValidity()) {
          showMessage("login-error", "Enter username and password.", "warn");
          return;
        }

        var data = new FormData(loginForm);
        var username = String(data.get("loginUsername") || "").trim();
        var password = String(data.get("loginPassword") || "").trim();
        var user = findUser(username);

        if (!user || user.password !== password) {
          showMessage("login-error", "Invalid username or password.", "warn");
          return;
        }

        setSession(user.username);
        showMessage("login-success", "Login successful.", "ok");
      });
    }
  }

  function eventCard(eventItem, user, index) {
    var teamsHtml = "";
    var isAdmin = user && user.role === "admin";

    if (isAdmin) {
      teamsHtml = eventItem.participants.length
        ? "<ul class=\"clean\">" +
          eventItem.participants
            .map(function (team) {
              return "<li>" + team + "</li>";
            })
            .join("") +
          "</ul>"
        : "<p class=\"meta\">No teams joined yet.</p>";
    } else {
      teamsHtml =
        "<p class=\"meta\">Teams joined: " + eventItem.participants.length + "</p>";
    }

    var joinBtn = "";
    if (!user || user.role !== "admin") {
      var alreadyJoined =
        !!user && eventItem.participantUsers.indexOf(user.username) >= 0;
      joinBtn =
        "<button class=\"btn " +
        (alreadyJoined ? "ghost" : "primary") +
        "\" data-event-index=\"" +
        index +
        "\" " +
        (alreadyJoined ? "disabled" : "") +
        ">" +
        (alreadyJoined ? "Joined" : user ? "Join Event" : "Join Event (Free Guest)") +
        "</button>";
    }

    return (
      "<article class=\"card span-6\">" +
      "<h3>" +
      eventItem.name +
      "</h3>" +
      "<p class=\"meta\">Campus: " +
      eventItem.campus +
      " | Time: " +
      eventItem.time +
      "</p>" +
      "<p class=\"meta\">Created by: " +
      eventItem.createdBy +
      "</p>" +
      (isAdmin ? "<h4>Teams in this event</h4>" : "") +
      teamsHtml +
      joinBtn +
      "</article>"
    );
  }

  function joinEvent(eventIndex, user) {
    var events = getEvents();
    var item = events[eventIndex];
    if (!item) return false;

    if (item.participantUsers.indexOf(user.username) >= 0) return false;
    item.participantUsers.push(user.username);
    item.participants.push(user.teamName || user.username + " Solo");
    saveEvents(events);
    return true;
  }

  function initEventsPage() {
    var board = document.getElementById("events-board");
    if (!board) return;

    var user = getCurrentUser();
    var gate = document.getElementById("events-gate");
    var adminPanel = document.getElementById("admin-panel");
    var createForm = document.getElementById("create-event-form");
    var pageStatus = document.getElementById("events-status");
    var joinAllWrap = document.getElementById("join-all-wrap");
    var joinAllBtn = document.getElementById("join-all-btn");
    var logoutBtn = document.getElementById("events-logout-btn");
    var guestLoginBtn = document.getElementById("guest-login-btn");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        window.location.reload();
      });
    }

    function createGuestAccount() {
      var users = getUsers();
      var guestNumber = 1;
      var guestName = "guest" + guestNumber;
      while (
        users.some(function (account) {
          return normalize(account.username) === normalize(guestName);
        })
      ) {
        guestNumber += 1;
        guestName = "guest" + guestNumber;
      }

      users.push({
        username: guestName,
        password: guestName,
        role: "player",
        teamName: guestName + " Team",
        isGuest: true
      });
      saveJson(USERS_KEY, users);
      setSession(guestName);
      return findUser(guestName);
    }

    function render() {
      user = getCurrentUser();
      var isLoggedIn = !!user;
      var isAdmin = isLoggedIn && user.role === "admin";

      gate.style.display = isLoggedIn ? "none" : "block";
      adminPanel.style.display = isAdmin ? "block" : "none";
      joinAllWrap.style.display = isAdmin ? "none" : "block";
      pageStatus.textContent = isLoggedIn
        ? "Logged in as " +
          user.username +
          " (" +
          (isAdmin ? "admin" : "competitor") +
          ")."
        : "You can join by creating a free guest account.";

      var events = getEvents();
      if (!events.length) {
        board.innerHTML =
          "<article class=\"card span-12\"><p>No events yet.</p></article>";
      } else {
        board.innerHTML = events
          .map(function (item, index) {
            return eventCard(item, user, index);
          })
          .join("");
      }

      if (!isAdmin) {
        var joinButtons = board.querySelectorAll("[data-event-index]");
        joinButtons.forEach(function (button) {
          button.addEventListener("click", function () {
            if (!user) {
              user = createGuestAccount();
            }
            var idx = Number(button.getAttribute("data-event-index"));
            var joined = joinEvent(idx, user);
            if (joined) {
              showMessage("events-feedback", "Joined event successfully.", "ok");
              if (guestLoginBtn && user && user.isGuest) {
                guestLoginBtn.textContent = "Guest Account Active";
                guestLoginBtn.disabled = true;
              }
              render();
            }
          });
        });
      }
    }

    if (createForm) {
      createForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage("events-feedback", "notice ok");
        if (!createForm.checkValidity()) {
          showMessage("events-feedback", "Complete all event fields.", "warn");
          return;
        }

        var data = new FormData(createForm);
        var events = getEvents();
        events.push({
          id: Date.now(),
          name: String(data.get("eventName") || "").trim(),
          campus: String(data.get("eventCampus") || ""),
          time: String(data.get("eventTime") || ""),
          createdBy: user.username,
          participants: [],
          participantUsers: []
        });
        saveEvents(events);
        createForm.reset();
        showMessage("events-feedback", "Event created.", "ok");
        render();
      });
    }

    if (guestLoginBtn) {
      guestLoginBtn.addEventListener("click", function () {
        var current = getCurrentUser();
        if (current) {
          showMessage("events-feedback", "You are already logged in.", "warn");
          return;
        }
        user = createGuestAccount();
        guestLoginBtn.textContent = "Guest Account Active";
        guestLoginBtn.disabled = true;
        showMessage(
          "events-feedback",
          "Guest account created. You can now join events.",
          "ok"
        );
        render();
      });
    }

    if (joinAllBtn) {
      joinAllBtn.addEventListener("click", function () {
        if (!user) {
          user = createGuestAccount();
          if (guestLoginBtn) {
            guestLoginBtn.textContent = "Guest Account Active";
            guestLoginBtn.disabled = true;
          }
        }

        var events = getEvents();
        var joinedCount = 0;
        events.forEach(function (_item, index) {
          if (joinEvent(index, user)) joinedCount += 1;
        });
        if (!events.length) {
          showMessage("events-feedback", "No events to join.", "warn");
        } else if (joinedCount === 0) {
          showMessage("events-feedback", "You already joined every event.", "warn");
        } else {
          showMessage(
            "events-feedback",
            "Joined " + joinedCount + " event(s).",
            "ok"
          );
        }
        render();
      });
    }

    if (guestLoginBtn && user && user.isGuest) {
      guestLoginBtn.textContent = "Guest Account Active";
      guestLoginBtn.disabled = true;
    }

    render();
  }

  function initAdminPage() {
    var board = document.getElementById("admin-events-board");
    if (!board) return;

    var user = getCurrentUser();
    var gate = document.getElementById("admin-gate");
    var panel = document.getElementById("admin-panel");
    var createForm = document.getElementById("admin-create-event-form");
    var status = document.getElementById("admin-status");
    var logoutBtn = document.getElementById("admin-logout-btn");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        window.location.reload();
      });
    }

    var isUncappedAdmin =
      user &&
      user.role === "admin" &&
      normalize(user.username) === UNCAPPED_NAME;

    if (!isUncappedAdmin) {
      gate.style.display = "block";
      panel.style.display = "none";
      board.innerHTML = "";
      status.textContent = "Admin tab requires uncapped account login.";
      return;
    }

    gate.style.display = "none";
    panel.style.display = "block";
    status.textContent = "Logged in as uncapped admin.";

    function renderAdminEvents() {
      var events = getEvents();
      if (!events.length) {
        board.innerHTML =
          "<article class=\"card span-12\"><p>No events yet.</p></article>";
        return;
      }

      board.innerHTML = events
        .map(function (item) {
          var teamsHtml = item.participants.length
            ? "<ul class=\"clean\">" +
              item.participants
                .map(function (team) {
                  return "<li>" + team + "</li>";
                })
                .join("") +
              "</ul>"
            : "<p class=\"meta\">No teams joined yet.</p>";

          return (
            "<article class=\"card span-6\">" +
            "<h3>" +
            item.name +
            "</h3>" +
            "<p class=\"meta\">Campus: " +
            item.campus +
            " | Time: " +
            item.time +
            "</p>" +
            "<h4>Teams in this event</h4>" +
            teamsHtml +
            "</article>"
          );
        })
        .join("");
    }

    createForm.addEventListener("submit", function (event) {
      event.preventDefault();
      hideMessage("admin-feedback", "notice ok");
      if (!createForm.checkValidity()) {
        showMessage("admin-feedback", "Complete all event fields.", "warn");
        return;
      }

      var data = new FormData(createForm);
      var events = getEvents();
      events.push({
        id: Date.now(),
        name: String(data.get("eventName") || "").trim(),
        campus: String(data.get("eventCampus") || ""),
        time: String(data.get("eventTime") || ""),
        createdBy: user.username,
        participants: [],
        participantUsers: []
      });
      saveEvents(events);
      createForm.reset();
      showMessage("admin-feedback", "Event created.", "ok");
      renderAdminEvents();
    });

    renderAdminEvents();
  }

  ensureAdminUser();
  initLoginPage();
  initEventsPage();
  initAdminPage();
})();
