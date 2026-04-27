const complaint = document.querySelector("#complaint");
const connectedAp = document.querySelector("#connectedAp");
const operatorId = document.querySelector("#operatorId");
const sinrDown = document.querySelector("#sinrDown");
const sinrUp = document.querySelector("#sinrUp");
const alignmentMetric = document.querySelector("#alignmentMetric");
const pathloss = document.querySelector("#pathloss");
const ping = document.querySelector("#ping");
const bandwidth = document.querySelector("#bandwidth");
const speed = document.querySelector("#speed");
const notes = document.querySelector("#notes");
const confirm = document.querySelector("#confirm");
const reset = document.querySelector("#reset");
const radioStillDown = document.querySelector("#radioStillDown");
const outageMode = document.querySelector("#outageMode");
const inputs = document.getElementsByTagName("input");

function findLable(e) {
  let idVal = e.id;
  labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i].innerHTML;
  }
}

function checklistCreator() {
  let troubleList = "Troubleshooting Checklist:\n\n";
  let currentInput;
  const checklist = document.getElementById("checklist");
  for (let j = 0; j < 19; j++) {
    currentInput = checklist.querySelectorAll("input")[j];
    if (currentInput.checked) {
      troubleList += `- ${findLable(currentInput)}\n`;
    }
  }
  return troubleList;
}

function createMessage() {
  let info = `Complaint: ${complaint.value}\n\nConnected AP: ${connectedAp.value}\nOperator ID: ${operatorId.value}\nSINR: ${sinrDown.value} / ${sinrUp.value}\nAlignment Metric: ${alignmentMetric.value}\nPathloss: ${pathloss.value} dB\nPing: ${ping.value} ms\nBandwidth: ${bandwidth.value} Mbps\nLAN Speed: ${speed.value}\n\n`;
  const checklist = checklistCreator();
  const notesValue = "\nNotes:\n\n" + notes.value;
  if(radioStillDown.checked || outageMode.checked) {
    info = `Complaint: ${complaint.value}\n\n`
  }
  const completeMessage = "Tarana\n\n" + info + checklist + notesValue;
  document.getElementById("clipboardConfirm").style.display = "flex";
  setTimeout(
    () => (document.getElementById("clipboardConfirm").style.display = "none"),
    5000
  );
  return navigator.clipboard.writeText(completeMessage);
}

const resetPage = () => {
  for (let k = 0; k < inputs.length; k++) {
    inputs[k].value = "";
    if (inputs[k].getAttribute("type") === "checkbox") {
      if(inputs[k].id === "outageMode") {
        continue;
      }
      inputs[k].checked = false;
    }
  }
  document.querySelector("textarea").value = "";
  disable();
}

function disable() {
  const disableBool = radioStillDown.checked || outageMode.checked;
  for (let l = 0; l < inputs.length; l++) {
    if(l === 0) {
      continue;
    }
    if (inputs[l].getAttribute("type") === "text") {
      inputs[l].disabled = disableBool;
    }
  }
}

confirm.addEventListener("click", createMessage);
reset.addEventListener("click", resetPage);
radioStillDown.addEventListener("click", disable);
outageMode.addEventListener("click", disable);
