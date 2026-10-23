const contacts = [
  { name: "Ava Thompson", number: "415-555-0142" },
  { name: "Noah Patel", number: "628-555-0188" },
  { name: "Mia Chen", number: "212-555-0199" },
  { name: "Lucas Reed", number: "310-555-0114" }
];

const recentCalls = [
  { name: "Ava Thompson", number: "415-555-0142", time: "Today, 9:14 AM", type: "outgoing" },
  { name: "Unknown Caller", number: "800-555-0100", time: "Yesterday, 6:42 PM", type: "missed" }
];

const numberInput = document.getElementById("numberInput");
const displayNumber = document.getElementById("displayNumber");
const callButton = document.getElementById("callButton");
const backspaceButton = document.getElementById("backspaceButton");
const contactsList = document.getElementById("contactsList");
const recentList = document.getElementById("recentList");
const callOverlay = document.getElementById("callOverlay");
const callStatus = document.getElementById("callStatus");
const callName = document.getElementById("callName");
const callNumber = document.getElementById("callNumber");
const callTimer = document.getElementById("callTimer");
const endButton = document.getElementById("endButton");
const incomingTrigger = document.getElementById("incomingTrigger");
const incomingActions = document.getElementById("incomingActions");
const acceptButton = document.getElementById("acceptButton");
const declineButton = document.getElementById("declineButton");

let activeCall = null;
let callStartedAt = null;
let timerId = null;

function syncDisplay() {
  const value = numberInput.value.trim();
  displayNumber.textContent = value || "Enter a number";
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function findContact(number) {
  return contacts.find((contact) => contact.number === number);
}

function renderContacts() {
  contactsList.innerHTML = contacts
    .map((contact) => {
      const initials = contact.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2);

      return `
        <article class="contact-item">
          <div class="avatar">${initials}</div>
          <div class="contact-meta">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-number">${contact.number}</div>
          </div>
          <button class="mini-call" data-contact-call="${contact.number}">Call</button>
        </article>
      `;
    })
    .join("");
}

function renderRecentCalls() {
  recentList.innerHTML = recentCalls
    .map((call) => {
      const label = call.type === "missed" ? "Missed" : "Outgoing";
      return `
        <article class="recent-item">
          <div class="recent-meta">
            <div class="recent-name">${call.name}</div>
            <div class="contact-number">${call.number}</div>
            <div class="recent-time">${label} • ${call.time}</div>
          </div>
          <button class="mini-call" data-recent-call="${call.number}">Call Back</button>
        </article>
      `;
    })
    .join("");
}

function addRecentCall(entry) {
  recentCalls.unshift(entry);
  if (recentCalls.length > 8) {
    recentCalls.pop();
  }
  renderRecentCalls();
}

function startTimer() {
  clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (!callStartedAt) {
      return;
    }
    const seconds = Math.floor((Date.now() - callStartedAt) / 1000);
    callTimer.textContent = formatSeconds(seconds);
  }, 1000);
}

function openCallOverlay() {
  callOverlay.classList.remove("hidden");
}

function closeCallOverlay() {
  callOverlay.classList.add("hidden");
  incomingActions.classList.add("hidden");
}

function connectCall() {
  if (!activeCall) {
    return;
  }
  callStatus.textContent = "Connected";
  callStartedAt = Date.now();
  callTimer.textContent = "00:00";
  startTimer();
}

function placeCall(number) {
  if (!number) {
    return;
  }

  const contact = findContact(number);
  activeCall = {
    name: contact ? contact.name : "Unknown Contact",
    number,
    direction: "outgoing"
  };

  callStatus.textContent = "Calling...";
  callName.textContent = activeCall.name;
  callNumber.textContent = activeCall.number;
  callTimer.textContent = "Connecting";
  incomingActions.classList.add("hidden");
  openCallOverlay();

  window.setTimeout(() => {
    if (activeCall && activeCall.number === number) {
      connectCall();
    }
  }, 1400);
}

function showIncomingCall() {
  activeCall = {
    name: "Sophia Rivera",
    number: "917-555-0136",
    direction: "incoming"
  };

  callStatus.textContent = "Incoming call";
  callName.textContent = activeCall.name;
  callNumber.textContent = activeCall.number;
  callTimer.textContent = "Answer or decline";
  incomingActions.classList.remove("hidden");
  openCallOverlay();
}

function endCall(status = "completed") {
  clearInterval(timerId);

  if (activeCall) {
    addRecentCall({
      name: activeCall.name,
      number: activeCall.number,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      type: status === "missed" ? "missed" : "outgoing"
    });
  }

  activeCall = null;
  callStartedAt = null;
  closeCallOverlay();
}

document.querySelectorAll("[data-tab-target]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab-target]").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll("[data-tab]").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`[data-tab="${button.dataset.tabTarget}"]`).classList.add("active");
  });
});

document.getElementById("keypad").addEventListener("click", (event) => {
  const key = event.target.closest("[data-value]");
  if (!key) {
    return;
  }
  numberInput.value += key.dataset.value;
  syncDisplay();
});

numberInput.addEventListener("input", syncDisplay);

backspaceButton.addEventListener("click", () => {
  numberInput.value = numberInput.value.slice(0, -1);
  syncDisplay();
});

callButton.addEventListener("click", () => {
  placeCall(numberInput.value.trim());
});

contactsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-contact-call]");
  if (!button) {
    return;
  }
  const number = button.dataset.contactCall;
  numberInput.value = number;
  syncDisplay();
  placeCall(number);
});

recentList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-recent-call]");
  if (!button) {
    return;
  }
  const number = button.dataset.recentCall;
  numberInput.value = number;
  syncDisplay();
  placeCall(number);
});

incomingTrigger.addEventListener("click", showIncomingCall);

acceptButton.addEventListener("click", () => {
  incomingActions.classList.add("hidden");
  connectCall();
});

declineButton.addEventListener("click", () => {
  endCall("missed");
});

endButton.addEventListener("click", () => {
  endCall();
});

document.querySelectorAll("[data-control]").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
  });
});

renderContacts();
renderRecentCalls();
syncDisplay();
