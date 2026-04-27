const notes = document.querySelector("#notes");
const confirm = document.querySelector("#confirm");
const reset = document.querySelector("#reset");
const resetYes = document.querySelector("#resetYes");
const resetNo = document.querySelector("#resetNo");
const resetConfirm = document.getElementById("resetConfirm");
const inputs = document.getElementsByTagName("input");
const ubiquitiButton = document.querySelector("#ubiquiti");
const telradButton = document.querySelector("#telrad");
const mimosaButton = document.querySelector("#mimosa");
const cambiumButton = document.querySelector("#cambium");
const taranaButton = document.querySelector("#tarana");
const apartmentsButton = document.querySelector("#apartments");
const engineeringButton = document.querySelector("#engineeringButton");
const complaints = document.querySelector("#complaints");
const checklist = document.getElementById("checklist");
const clipboardConfirm = document.getElementById("clipboardConfirm");
const settingsContainer = document.getElementById("settingsContainer");
const settingsButton = document.getElementById("settingsButton");
const settingsConfirm = document.getElementById("settingsConfirm");
const settingsCancel = document.getElementById("settingsCancel");
const font = document.getElementById("font");
const notesFont = document.getElementById("notesFont");
const background = document.getElementById("background");
const foreground = document.getElementById("foreground");
const textColor = document.getElementById("textColor");
const inputTextColor = document.getElementById("inputTextColor");
const inputBackgroundColor = document.getElementById("inputBackgroundColor");
const resetRadioOn = document.getElementById("resetRadioOn");
const resetRadioOff = document.getElementById("resetRadioOff");
const ttuCheckbox = document.getElementById("ttuCheckbox");
const defaultButton = document.getElementById("defaultButton");
const resetDefaultContainer = document.getElementById("resetDefaultContainer");
const defaultYes = document.getElementById("defaultYes");
const defaultNo = document.getElementById("defaultNo");
const cog = document.getElementById("cog");
const onCallSpan = document.getElementById("onCallSpan");
const onCallSVG = document.getElementById("onCallSVG");
const onCallSVGIcon = document.getElementById("onCallSVGIcon");
const maintenancePopupButton = document.getElementById("maintenancePopupButton");
const maintenanceInfoPopup = document.getElementById("maintenanceInfoPopup");
const closeMaintenanceInfoPopup = document.getElementById("closeMaintenanceInfoPopup")
const defaultSettings = {
  font: "12",
  notesFont: "20",
  background: "#212121",
  foreground: "#303030",
  textColor: "#ffffff",
  inputTextColor: "#000000",
  inputBackgroundColor: "#ffffff",
  resetPrompt: true,
  ttu: false
};
let radioStillDown = document.querySelector("#radioStillDown");
let outageMode = document.querySelector("#outageMode");
let resetPrompt = true;
let refreshing = false;
let settings = {};
let currentRadio;
let maintenanceArray = [];

// finds the label for the input thats passed as an argument
function findLable(e) {
  const idValue = e.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idValue) return labels[i].innerHTML;
  }
}

// creates the checklist for the ticket
function checklistCreator() {
  if (currentRadio.id === "engineering") return "";
  const ttuBool = settings.ttu ? 0 : (-1);
  let troubleList = "Troubleshooting Checklist:\n\n";
  let currentInput;
  for (let j = 0; j < checklist.querySelectorAll("input").length + ttuBool; j++) {
    currentInput = checklist.querySelectorAll("input")[j];
    if (currentInput.checked) {
      troubleList += `- ${findLable(currentInput) + ((j >= 16 && settings.ttu) ? " Photo Uploaded" : "")}\n`;
    }
  }
  return troubleList;
}

// creates the ticket and adds it to the clipboard
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

// resets all inputs and text area
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
}

// disables inputs if radio still down or outage mode is checked
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

// changes the info containers inputs and page colors based on selected radio
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

// sets settings values to current pages values
function setSettingsTab() {
  font.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--primaryFont")
    .trim()
    .replace("px", "");
  notesFont.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--notesFont")
    .trim()
    .replace("px", "");
  background.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();
  foreground.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--foreground")
    .trim();
  textColor.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--textColor")
    .trim();
  inputTextColor.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--inputTextColor")
    .trim();
  inputBackgroundColor.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--inputBackgroundColor")
    .trim();
  resetRadioOn.checked = settings.resetPrompt;
  resetRadioOff.checked = !settings.resetPrompt;
  ttuCheckbox.checked = settings.ttu;
  fontExample("font");
  fontExample("notesFont");
}

// changes the font size in the settings bases on slider input
function fontExample(element) {
  document.getElementById(element + "Value").innerText =
    "Size: " + (element === "font" ? +font.value : notesFont.value);
  document.getElementById(element + "Example").style.cssText =
    "font-size:" + (element === "font" ? font.value : notesFont.value) + "px;";
}

// stores settings locally in json if settings change
function updateStorage() {
  settings = {
    font: font.value,
    notesFont: notesFont.value,
    background: background.value,
    foreground: foreground.value,
    textColor: textColor.value,
    inputTextColor: inputTextColor.value,
    inputBackgroundColor: inputBackgroundColor.value,
    resetPrompt: resetRadioOn.checked,
    ttu: ttuCheckbox.checked
  };
  updateSettings();
  localStorage.setItem("settings", JSON.stringify(settings));
}

// changes css based on user selected settings
function updateSettings() {
  document.documentElement.style.setProperty(
    "--primaryFont",
    settings.font + "px"
  );
  document.documentElement.style.setProperty(
    "--notesFont",
    settings.notesFont + "px"
  );
  document.documentElement.style.setProperty(
    "--background",
    settings.background
  );
  document.documentElement.style.setProperty(
    "--foreground",
    settings.foreground
  );
  document.documentElement.style.setProperty("--textColor", settings.textColor);
  document.documentElement.style.setProperty(
    "--inputTextColor",
    settings.inputTextColor
  );
  document.documentElement.style.setProperty(
    "--inputBackgroundColor",
    settings.inputBackgroundColor
  );
  resetPrompt = settings.resetPrompt;
  changeCheckbox()
  settingsContainer.style.cssText = "dispaly: none;";
  setSettingsTab();
  cog.style.transform = "rotate(0deg)";
}

// Changes the checklist based on if TTU is checked
function changeCheckbox() {
  if (settings.ttu) {
    radioStillDown = document.querySelector("#radioStillDown");
    outageMode = document.querySelector("#outageMode");
    radioStillDown.removeEventListener("click", disable);
    outageMode.removeEventListener("click", disable);
    complaints.innerHTML = `
            <option>No Connection</option>
            <option>Intermittent Connection</option>
            <option>Slow Speeds</option>
            <option>Router Support</option>
            <option>Technical Support</option>
            <option>VOIP</option>
            <option>Billing</option>
            <option>Outage</option>
            <option>Retention</option>
            <option>Offload</option>
            <option>Install</option>
            <option>Service Call</option>
            <option>Move</option>
            <option>PtP Job</option>`
  } else {
    complaints.innerHTML = `
            <option>No Connection</option>
            <option>Intermittent Connection</option>
            <option>Slow Speeds</option>
            <option>Router Support</option>
            <option>Technical Support</option>
            <option>VOIP</option>
            <option>Billing</option>
            <option>Outage</option>
            <option>Retention</option>`
  }
  checklist.innerHTML = "";
  checklist.innerHTML = ttuCheckbox.checked
    ? `<div>
          <input type="checkbox" id="signedContracts" />
          <label for="signedContracts">Contracts are signed</label>
        </div>
        <div>
          <input type="checkbox" id="equipmentAdded" />
          <label for="equipmentAdded">Equipment added and assigned to the account</label>
        </div>
        <div>
          <input type="checkbox" id="radioUpToDate" />
          <label for="radioUpToDate">Radio firmware is up to date</label>
        </div>
        <div>
          <input type="checkbox" id="routerUpToDate"/>
          <label for="routerUpToDate">Router firmware is up to date</label>
        </div>
        <div>
          <input type="checkbox" id="photosUploaded"/>
          <label for="photosUploaded">Photos are uploaded to the account/job</label>
        </div>
        <div>
          <input type="checkbox" id="baseline"/>
          <label for="baseline">Speed test ran in TCS and set as baseline</label>
        </div>
        <div>
          <input type="checkbox" id="routerSpeeds"/>
          <label for="routerSpeeds">Pulling speeds in the Router</label>
        </div>
        <div>
          <input type="checkbox" id="signalIsBetter"/>
          <label for="signalIsBetter">Signal is better than -75 in Ubiquiti, Cambium, Mimosa Radios</label>
        </div>
        <div>
          <input type="checkbox" id="tcsSLA"/>
          <label for="tcsSLA">SLA profile is set to customers plan in TCS</label>
        </div>
        <div>
          <input type="checkbox" id="coordinates"/>
          <label for="coordinates">Coordinates have been checked in TCS and Sonar</label>
        </div>
        <div>
          <input type="checkbox" id="matchingBN"/>
          <label for="matchingBN">Primary and Connected BN are matching in TCS</label>
        </div>
        <div>
          <input type="checkbox" id="allCarriers"/>
          <label for="allCarriers">ALL carriers are active in TCS</label>
        </div>
        <div>
          <input type="checkbox" id="alignment16"/>
          <label for="alignment16">Alignment Metric is over 16 in TCS</label>
        </div>
        <div>
          <input type="checkbox" id="pathloss145"/>
          <label for="pathloss145">Pathloss is less than 145 in TCS</label>
        </div>
        <div>
          <input type="checkbox" id="SINR10db"/>
          <label for="SINR10db">SINRs over 10db in TCS</label>
        </div>
        <div class="outageMode">
          <input type="checkbox" id="ptpAccessible"/>
          <label for="ptpAccessible">PtP is accessible</label>
        </div>
        <div class="bold fourMarginTop">
          Photos Uploaded
        </div>
        <div>
          <input type="checkbox" id="losPhoto"/>
          <label for="losPhoto">LoS</label>
        </div>
        <div>
          <input type="checkbox" id="mountPhoto"/>
          <label for="mountPhoto">Radio Mount W/Grommet</label>
        </div>
        <div>
          <input type="checkbox" id="insideCablePhoto"/>
          <label for="insideCablePhoto">Inside Cable Entry</label>
        </div>
        <div>
          <input type="checkbox" id="outsideCablePhoto"/>
          <label for="outsideCablePhoto">Outside Cable Entry</label>
        </div>
        <div>
          <input type="checkbox" id="fohPhoto"/>
          <label for="fohPhoto">FoH</label>
        </div>
        <div>
          <input type="checkbox" id="routerPhoto"/>
          <label for="routerPhoto">Router</label>
        </div>
        <div>
          <input type="checkbox" id="poePhoto"/>
          <label for="poePhoto">PoE</label>
        </div>
        <div>
          <input type="checkbox" id="speedPhoto"/>
          <label for="speedPhoto">Speed Test</label>
        </div>
        <div>
          <input type="checkbox" id="wifiAnalyzerPhoto"/>
          <label for="wifiAnalyzerPhoto">2G/5G Wifi Analyzer</label>
        </div>
        <div>
          <input type="checkbox" id="pingTracePhoto"/>
          <label for="pingTracePhoto">Ping/Traceroute</label>
        </div>
        <div>
          <input type="checkbox" id="webUIPhoto"/>
          <label for="webUIPhoto">WebUI Dashboard</label>
        </div>
        <div class="outageMode">
          <input type="checkbox" id="alignmentPhoto"/>
          <label for="alignmentPhoto">Alignment</label>
        </div>
       `
    : `<div>
          <input type="checkbox" id="radioDownAtStart" />
          <label for="radioDownAtStart">Radio Was Down at the Start</label>
        </div>
        <div>
          <input type="checkbox" id="powerCycleRadio" />
          <label for="powerCycleRadio">Power Cycled Radio</label>
        </div>
        <div>
          <input type="checkbox" id="powerCycleRouter" />
          <label for="powerCycleRouter">Power Cycled Router</label>
        </div>
        <div>
          <input type="checkbox" id="customerRouter" />
          <label for="customerRouter">Customer Owned Router</label>
        </div>
        <div>
          <input type="checkbox" id="reseatCables" />
          <label for="reseatCables">Reseat Cables</label>
        </div>
        <div>
          <input type="checkbox" id="cablePositions" />
          <label for="cablePositions">Verified Cable Positions</label>
        </div>
        <div>
          <input type="checkbox" id="cableEnds" />
          <label for="cableEnds">Checked Cable Ends</label>
        </div>
        <div>
          <input type="checkbox" id="verifiedPower" />
          <label for="verifiedPower">Verified Power to Equipment</label>
        </div>
        <div>
          <input type="checkbox" id="routerMAC" />
          <label for="routerMAC">Verified Router Mac</label>
        </div>
        <div>
          <input type="checkbox" id="devicesConnected" />
          <label for="devicesConnected">Devices Connected</label>
        </div>
        <div>
          <input type="checkbox" id="routerFirmware" />
          <label for="routerFirmware">Upgrade Router Firmware</label>
        </div>
        <div>
          <input type="checkbox" id="radioFirmware" />
          <label for="radioFirmware">Update Radio Firmware</label>
        </div>
        <div>
          <input type="checkbox" id="movedAp" />
          <label for="movedAp">Moved AP/PCI</label>
        </div>
        <div>
          <input type="checkbox" id="checkedPing" />
          <label for="checkedPing">Checked Ping</label>
        </div>
        <div>
          <input type="checkbox" id="checkedBandwidth" />
          <label for="checkedBandwidth">Checked Bandwidth</label>
        </div>
        <div>
          <input type="checkbox" id="noAnswer" />
          <label for="noAnswer">Called No Answer</label>
        </div>
        <div>
          <input type="checkbox" id="leftVoicemail" />
          <label for="leftVoicemail">Left Voicemail</label>
        </div>
        <div>
          <input type="checkbox" id="refusedToTroubleshoot" />
          <label for="refusedToTroubleshoot">Refused to Troubleshoot</label>
        </div>
        <div>
          <input type="checkbox" id="radioStillDown" />
          <label for="radioStillDown">Radio Still Down</label>
        </div>
        <div class="outageMode">
          <input type="checkbox" id="outageMode" />
          <label for="outageMode">Outage Mode</label>
        </div>`;
  if (ttuCheckbox.checked === false) {
    radioStillDown = document.querySelector("#radioStillDown");
    outageMode = document.querySelector("#outageMode");
    radioStillDown.addEventListener("click", disable);
    outageMode.addEventListener("click", disable);
  }
}

// runs functions on startup
function startUp() {
  const tempSettings = JSON.parse(localStorage.getItem("settings"));
  settings = tempSettings || defaultSettings;
  checkForNewSettings();
  setSettingsTab();
  updateSettings();
  showInfoContainers("ubiquitiRadio");
  setOnCall();
  maintenanceListGenerator();
}

// shows whos on call at the bottom of the page
function setOnCall() {
  const setDate = Date.parse("06 Nov 2023");
  const difference = Date.now() - setDate;
  const weekAlgorithm = Math.floor(difference / 1000 / 60 / 60 / 24 / 7) % 3;
  let current;
  switch (weekAlgorithm) {
    case 0:
      current = "Nicholas Penaranda";
      break;
    case 1:
      current = "Trey Wiggins";
      break;
    case 2:
      current = "Willis Penaranda";
      break;
    default:
      break;
  }
  onCallSpan.innerText = current;
}

// refreshes the on call line and plays an animation
async function refreshOnCall() {
  refreshing = true;
  onCallSVGIcon.classList.add("spin");
  //onCallSVGIcon.classList.add("fadeOutAnimation")
  onCallSpan.classList.add("fadeOutAnimation");
  await new Promise((resolve) => setTimeout(resolve, 550));
  setOnCall();
  await new Promise((resolve) => setTimeout(resolve, 50));
  //onCallSVGIcon.classList.add("fadeInAnimation")
  onCallSpan.classList.add("fadeInAnimation");
  await new Promise((resolve) => setTimeout(resolve, 550));
  onCallSpan.classList.remove("fadeOutAnimation");
  onCallSpan.classList.remove("fadeInAnimation");
  //onCallSVGIcon.classList.remove("fadeOutAnimation")
  //onCallSVGIcon.classList.remove("fadeInAnimation")
  onCallSVGIcon.classList.remove("spin");
  refreshing = false;
}

function maintenanceListGenerator() {
  const splitLines1 = (str) => str.split("**********")
  const splitLines2 = (str) => str.split(/\r?\n\n/)
  const initialArray = splitLines1(`

This Maintenance is Approved


If request is rejected. Please resubmit with another date/time or contact the NOCC for assistance via phone <tel: 806.419.1080>  or via email <mailto: nocc@resoundnetworks.com> 

________________________________


Requested By

________________________________


Department: NOCC

Requested By: Vendor Maintenance 

________________________________


Maintenance Info


Maintenance Type: 

Normal Maintenance

Fiber Vendor (If Applicable):

FiberVendor

Affected Market:

MarketName; 

Affected Site(s): 

Example Site Name; 

# of Affected Site(s): 

1

Scope Of Work:

example of work done

Backout Plan:

Vendor

Start Date/Time:

4/26/2026 11:00 PM

End Date/Time:

4/27/2026 6:00 AM

**********`)
  const furtherDividedArray = []

  for (let i = 0; i < initialArray.length - 1; i++) {
    furtherDividedArray.push(splitLines2(initialArray[i]))
  }

  const maintenanceInfoContainer = document.querySelector("#maintenanceInfoContainer")
  const tempArray = []

  for (let i = 0; i < furtherDividedArray.length; i++) {
    let startTimeIndex = furtherDividedArray[i].findIndex(elem => elem === "Start Date/Time:")
    const affectedSitesIndex = furtherDividedArray[i].findIndex(elem => elem === "Affected Site(s): ") + 1
    const scopeOfWorkIndex = furtherDividedArray[i].findIndex(elem => elem === "Scope Of Work:") + 1
    const maintenanceBlock = document.createElement("div")
    const startContainer = document.createElement("div")
    const endContainer = document.createElement("div")
    const affectedSitesContainer = document.createElement("div")
    const scopeOfWorkContainer = document.createElement("div")

    startContainer.innerText = "Start Time: " + furtherDividedArray[i][startTimeIndex + 1]
    startContainer.classList.add("startContainer")
    endContainer.innerText = " End Time: " + furtherDividedArray[i][startTimeIndex + 3]
    endContainer.classList.add("endContainer")
    affectedSitesContainer.innerText = "Affected Sites: " + affectedSitesCleaner(furtherDividedArray[i][affectedSitesIndex])
    affectedSitesContainer.classList.add("affectedSitesContainer")
    scopeOfWorkContainer.innerText = "Scope of Work: " + furtherDividedArray[i][scopeOfWorkIndex]
    scopeOfWorkContainer.classList.add("scopeOfWorkContainer")

    maintenanceBlock.append(startContainer, endContainer, affectedSitesContainer, scopeOfWorkContainer)
    maintenanceBlock.classList.add("maintenanceBlock")
    tempArray.push(maintenanceBlock)
  }
  maintenanceArray = sortByDate(tempArray)
  maintenanceInfoContainer.append(...maintenanceArray)
} 

//sorts infoContainer elements by their start date
function sortByDate(argArray) {
  argArray.sort((div1, div2) => Date.parse(div2.querySelector(".startContainer").innerText) - Date.parse(div1.querySelector(".startContainer").innerText))
  return argArray
}

//remove the junk from affected sites names if site doesn't match the regex it just puts it through
function affectedSitesCleaner(argString) {
  const argArray = argString.split("; ")
  let newString = "| "
  for (let i = 0; i < argArray.length - 1; i++) {
    const regex = /^[^-]+-[^-]+-([^-]+)-?/
    const match = argArray[i].match(regex)
    newString += match !== null ? match[1] + " | " : argArray[i] + " | "
  }
  return newString
}

//pushes page view towards a maintenance block thats up next
function pushPageTowardCurrentTime(argArray) {
  const targetDiv = argArray[argArray.findIndex(div => Date.parse(div.querySelector(".startContainer").innerText) < Date.now()) - 1]
  targetDiv.scrollIntoView({
    behavior: "auto",
    block: "center"
  })
  targetDiv.classList.add("glow")
  return
}


// checks for new settings in default settings and adds them to the JSON if it exist
function checkForNewSettings() {
  const checkIfJSONExist =
    JSON.parse(localStorage.getItem("settings")) || false;
  let tempBool = false;
  if (!checkIfJSONExist) {
    console.log("no JSON");
    return;
  }
  for (const key in defaultSettings) {
    if (!checkIfJSONExist[key]) {
      settings[key] = defaultSettings[key];
      tempBool = true;
    }
  }
  console.log(tempBool ? "update complete" : "no update needed");
}

//listens for reset button press
reset.addEventListener("click", () => {
  if (resetPrompt) {
    resetConfirm.style.cssText = "display: flex;";
  } else {
    resetPage();
  }
});
//listens for click on on call refresh icon
onCallSVG.addEventListener("click", () => {
  if (refreshing === false) {
    refreshOnCall();
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
  setSettingsTab();
  if (settingsContainer.style.display === "flex") {
    settingsContainer.style.cssText = "display: none;";
    cog.style.transform = "rotate(0deg)";
  } else {
    settingsContainer.style.cssText = "display: flex;";
    cog.style.transform = "rotate(180deg)";
  }
});
settingsCancel.addEventListener("click", () => {
  setSettingsTab();
  settingsContainer.style.cssText = "dispaly: none;";
  cog.style.transform = "rotate(0deg)";
});
settingsConfirm.addEventListener("click", updateStorage);
font.addEventListener("input", () => {
  fontExample("font");
});
notesFont.addEventListener("input", () => {
  fontExample("notesFont");
});
defaultButton.addEventListener("click", () => {
  resetDefaultContainer.style.cssText = "display: flex;";
});
defaultYes.addEventListener("click", () => {
  settings = defaultSettings;
  updateSettings();
  localStorage.setItem("settings", JSON.stringify(settings));

  resetDefaultContainer.style.cssText = "display: none;";
});
defaultNo.addEventListener("click", () => {
  resetDefaultContainer.style.cssText = "display: none;";
});
maintenancePopupButton.addEventListener("click", () => {
  maintenanceInfoPopup.style.cssText = "display: block";
  maintenancePopupButton.style.cssText = "display: none";
  pushPageTowardCurrentTime(maintenanceArray)
});
closeMaintenanceInfoPopup.addEventListener("click", () => {
  maintenanceInfoPopup.style.cssText = "display: none";
  maintenancePopupButton.style.cssText = "display: block";
})
maintenanceInfoPopup.addEventListener("click", (elem) => {
  if (elem.target.id !== "maintenanceInfoPopup") return;
  maintenanceInfoPopup.style.cssText = "display: none";
  maintenancePopupButton.style.cssText = "display: block";
})

startUp();