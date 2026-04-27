const notes = document.querySelector("#notes");
const confirm = document.querySelector("#confirm");
const reset = document.querySelector("#reset");
const resetYes = document.querySelector("#resetYes");
const resetNo = document.querySelector("#resetNo");
const resetConfirm = document.getElementById("resetConfirm");
const radioStillDown = document.querySelector("#radioStillDown");
const outageMode = document.querySelector("#outageMode");
const inputs = document.getElementsByTagName("input");
const ubiquitiButton = document.querySelector("#ubiquiti");
const telradButton = document.querySelector("#telrad");
const mimosaButton = document.querySelector("#mimosa");
const cambiumButton = document.querySelector("#cambium");
const taranaButton = document.querySelector("#tarana");
const apartmentsButton = document.querySelector("#apartments");
const engineeringButton = document.querySelector("#engineeringButton");
const clipboardConfirm = document.getElementById("clipboardConfirm");
const settingsContainer = document.getElementById("settingsContainer");
const settingsButton = document.getElementById("settingsButton");
const settingsConfirm = document.getElementById("settingsConfirm");
const settingsCancel = document.getElementById("settingsCancel");
const font = document.getElementById("font")
const notesFont = document.getElementById("notesFont")
const background = document.getElementById("background")
const foreground = document.getElementById("foreground")
const textColor = document.getElementById("textColor")
const resetRadioOn = document.getElementById("resetRadioOn")
const resetRadioOff = document.getElementById("resetRadioOff")
const defaultButton = document.getElementById("defaultButton")
const resetDefaultContainer = document.getElementById("resetDefaultContainer")
const defaultYes = document.getElementById("defaultYes")
const defaultNo = document.getElementById("defaultNo")
const cog = document.getElementById("cog")
const defaultSettings = {font: "12", notesFont: "20", background: "#212121", foreground: "#303030", textColor: "#ffffff", resetPrompt: true};
let resetPrompt = true;
let settings = {};
let currentRadio;


function findLable(e) {
  let idVal = e.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i].innerHTML;
  }
}

function checklistCreator() {
  if (currentRadio.id === "engineering") return "";
  let troubleList = "Troubleshooting Checklist:\n\n";
  let currentInput;
  const checklist = document.getElementById("checklist");
  for (let j = 0; j < checklist.querySelectorAll("input").length - 1; j++) {
    currentInput = checklist.querySelectorAll("input")[j];
    if (currentInput.checked) {
      troubleList += `- ${findLable(currentInput)}\n`;
    }
  }
  return troubleList;
}

function createMessage() {
  let info =
    currentRadio.id === "engineering"
      ? ""
      : `${complaint.value ? "Complaint: " + complaint.value + "\n\n" : ""}`;
  let currentLabel;
  let currentInput;
  let remoteSignal;
  let currentId;
  for (let m = 0; m < currentRadio.querySelectorAll("input").length; m++) {
    currentInput = currentRadio.querySelectorAll("input")[m];
    currentId = currentInput.id;
    if (currentInput.value) {
      if (currentInput.id === "remoteSignal") {
        remoteSignal = currentInput.value;
        continue;
      } else if (currentId.includes("Chains")) {
        if (currentId.includes("remote")) {
          info += `Remote Signal: -${remoteSignal} Δ${currentInput.value}\n`;
          continue;
        } else {
          info += ` Δ${currentInput.value}\n`;
          continue;
        }
      }
      currentLabel = findLable(currentInput);
      info += `${currentLabel}${
        currentId.includes("signal") ||
        currentId.includes("Signal") ||
        currentId.includes("Noise")
          ? " -"
          : " "
      }${currentInput.value}`;
      switch (currentLabel) {
        case "Ping:":
          info += " ms";
          break;
        case "Bandwidth:":
          info += " mbps";
          break;
        case "Pathloss:":
          info += " dB";
          break;
        case "Radio Frequency:":
        case "Router Frequency:":
          info += " MHz";
          break;
        default:
          break;
      }
      if (currentLabel === "Local Signal:") {
        continue;
      }
      info += "\n";
    }
  }
  info += "\n";
  const checklist = checklistCreator();
  const notesValue = "\nNotes:\n\n" + notes.value;
  if (radioStillDown.checked || outageMode.checked) {
    info = `Complaint: ${complaint.value}\n\n`;
  }
  let radioName = currentRadio.id;
  radioName = radioName.split("");
  radioName[0] = radioName[0].toUpperCase();
  radioName = radioName.join("");
  const completeMessage =
    (currentRadio.id === "engineering"
      ? "ENG Escalation - " +
        document.querySelector("#engineeringCustomer").value +
        " ID: " +
        document.querySelector("#engineeringID").value +
        " - " +
        document.querySelector("#engineeringTechnology").value +
        " - " +
        complaint.value +
        `\n`
      : `${radioName.replace("Radio", "")}\n\n`) +
    info +
    checklist +
    notesValue;
  document.getElementById("clipboardConfirm").style.display = "flex";
  setTimeout(
    () => (document.getElementById("clipboardConfirm").style.display = "none"),
    5000
  );
  return navigator.clipboard.writeText(completeMessage);
}

function resetPage() {
  for (let k = 0; k < inputs.length; k++) {
    inputs[k].value = "";
    if (inputs[k].getAttribute("type") === "checkbox") {
      if (inputs[k].id === "outageMode") {
        continue;
      }
      inputs[k].checked = false;
    }
  }
  document.querySelector("textarea").value = "";
  resetConfirm.style.cssText = "display: none;";
  disable();
};

function disable() {
  const disableBool = radioStillDown.checked || outageMode.checked;
  for (let l = 0; l < inputs.length; l++) {
    if (l === 0) {
      continue;
    }
    if (inputs[l].getAttribute("type") === "text") {
      inputs[l].disabled = disableBool;
    }
  }
}

function showInfoContainers(radio, e = { target: { id: "ubiquiti" } }) {
  const radios = document.querySelectorAll(".radioInfo");
  const radioButtons = document.querySelectorAll("button");
  let currentColor;
  for (let n = 0; n < radios.length; n++) {
    radios[n].style.display = "none";
  }
  currentRadio = document.getElementById(radio);
  currentRadio.style.display = "grid";
  switch (e.target.id) {
    case "ubiquiti":
      currentColor = "#2a81fa";
      break;
    case "telrad":
      currentColor = "#bbc3fa";
      break;
    case "mimosa":
      currentColor = "#fa8e1b";
      break;
    case "cambium":
      currentColor = "#4c28fc";
      break;
    case "tarana":
      currentColor = "#239664";
      break;
    case "apartments":
      currentColor = "#cf0a76";
      break;
    default:
      currentColor = "#212121";
      break;
  }
  document.documentElement.style.setProperty("--color", currentColor);
  for (let b = 0; b < radioButtons.length; b++) {
    if (
      document
        .getElementById(radioButtons[b].id)
        ?.classList.contains("selected")
    ) {
      document.getElementById(radioButtons[b].id).classList.toggle("selected");
    }
    if (radioButtons[b].id === e.target.id) {
      document.getElementById(radioButtons[b].id).classList.toggle("selected");
      continue;
    }
  }
}

function setSettingsTab() {
  font.value = getComputedStyle(
    document.documentElement
  )
    .getPropertyValue("--primaryFont")
    .trim()
    .replace("px", "");
  notesFont.value = getComputedStyle(
    document.documentElement
  )
    .getPropertyValue("--notesFont")
    .trim()
    .replace("px", "");
  background.value = getComputedStyle(
    document.documentElement
  )
    .getPropertyValue("--background")
    .trim();
  foreground.value = getComputedStyle(
    document.documentElement
  )
    .getPropertyValue("--foreground")
    .trim();
  textColor.value = getComputedStyle(
    document.documentElement
  )
    .getPropertyValue("--textColor")
    .trim();
  resetRadioOn.checked = settings.resetPrompt;
  resetRadioOff.checked = !settings.resetPrompt;
  fontExample("font")
  fontExample("notesFont")
}

function fontExample(element) {
  document.getElementById(element + "Value").innerText = "Size: " + (element === "font" ? + font.value : notesFont.value)
  document.getElementById(element + "Example").style.cssText = "font-size:" + (element === "font" ? font.value : notesFont.value) + "px;"
}

function updateStorage() {
  settings = {font: font.value, notesFont: notesFont.value, background: background.value, foreground: foreground.value, textColor: textColor.value, resetPrompt: resetRadioOn.checked}
  updateSettings()
  localStorage.setItem("settings", JSON.stringify(settings));
}

function updateSettings() {
  document.documentElement.style.setProperty("--primaryFont", settings.font + "px");
  document.documentElement.style.setProperty("--notesFont", settings.notesFont + "px");
  document.documentElement.style.setProperty("--background", settings.background);
  document.documentElement.style.setProperty("--foreground", settings.foreground);
  document.documentElement.style.setProperty("--textColor", settings.textColor);
  resetPrompt = settings.resetPrompt;
  settingsContainer.style.cssText = "dispaly: none;"
  setSettingsTab()
  cog.style.transform = "rotate(0deg)";
}

function startUp() {
  settings = JSON.parse(localStorage.getItem("settings")) || defaultSettings;
  setSettingsTab()
  updateSettings()
  showInfoContainers("ubiquitiRadio");
}

//listens for reset button press
reset.addEventListener("click", () => {
  if(resetPrompt) {
    resetConfirm.style.cssText = "display: flex;";
  } else {
    resetPage()
  }
});
//listens for click on either yes or no for resetConfirm
resetYes.addEventListener("click", resetPage);
resetNo.addEventListener("click", () => {
  resetConfirm.style.cssText = "display: none;";
});
clipboardConfirm.addEventListener("click", () => {
  clipboardConfirm.style.display = "none";
});
confirm.addEventListener("click", createMessage);
radioStillDown.addEventListener("click", disable);
outageMode.addEventListener("click", disable);
ubiquitiButton.addEventListener("click", (e) =>
  showInfoContainers("ubiquitiRadio", e)
);
telradButton.addEventListener("click", (e) =>
  showInfoContainers("telradRadio", e)
);
mimosaButton.addEventListener("click", (e) =>
  showInfoContainers("mimosaRadio", e)
);
cambiumButton.addEventListener("click", (e) =>
  showInfoContainers("cambiumRadio", e)
);
taranaButton.addEventListener("click", (e) =>
  showInfoContainers("taranaRadio", e)
);
apartmentsButton.addEventListener("click", (e) =>
  showInfoContainers("apartmentsRadio", e)
);
engineeringButton.addEventListener("click", (e) =>
  showInfoContainers("engineering", e)
);
settingsButton.addEventListener("click", () => {
  setSettingsTab()
  if(settingsContainer.style.display === "flex") {
    settingsContainer.style.cssText = "display: none;"
    cog.style.transform = "rotate(0deg)";
  } else {
    settingsContainer.style.cssText = "display: flex;";
    cog.style.transform = "rotate(180deg)";
  }

});
settingsCancel.addEventListener(
  "click",
  () => {
    setSettingsTab()
    settingsContainer.style.cssText = "dispaly: none;"
    cog.style.transform = "rotate(0deg)";
});
settingsConfirm.addEventListener("click", updateStorage)
font.addEventListener("input", () => {
  fontExample("font")
})
notesFont.addEventListener("input", () => {
  fontExample("notesFont")
})
defaultButton.addEventListener("click", () => {
  resetDefaultContainer.style.cssText = "display: flex;";
})
defaultYes.addEventListener("click", () => {
  settings = defaultSettings;
  updateSettings()
  localStorage.setItem("settings", JSON.stringify(settings));

  resetDefaultContainer.style.cssText = "display: none;";
})
defaultNo.addEventListener("click", () => {
  resetDefaultContainer.style.cssText = "display: none;";
})

startUp()