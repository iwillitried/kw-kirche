const nameField = document.getElementById("albumTitelInput");
const artistField = document.getElementById("artistField");
const priceField = document.getElementById("priceField");
const durationField = document.getElementById("durationField");
const tracksField = document.getElementById("tracksField");
const cdsField = document.getElementById("cdsField");

const submitButton = document.getElementById("submit")
submitButton.addEventListener("submit", submitClicked);

function submitClicked() {
  console.log("Album Name: " + nameField.value);

}
