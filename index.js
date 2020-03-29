
const nameField = document.getElementById("albumTitelInput");
const artistField = document.getElementById("artistField");
const priceField = document.getElementById("priceField");
const durationField = document.getElementById("durationField");
const tracksField = document.getElementById("tracksField");
const cdsField = document.getElementById("cdsField");

const submitButton = document.getElementById("submit"); // Listener to submitClicked() added in html
const trackArray = [];
const artworkFile = ""; 

function removeTrackField(e) {
  let trackNumber = e.target.id.charAt(0);
  let trackbox = document.getElementById("trackbox");
  let trackField = document.getElementById(""+trackNumber+"trackField");
  trackbox.removeChild(trackField);
  // Remove file from array
  trackArray.splice(trackNumber, 1);


}

function handleTrackFiles(files) {
  let file = files[0];
  let audioType = /^audio\//;

  if (!audioType.test(file.type)) {
    return;
  }

  // Build a TrackField
  let trackbox = document.getElementById("trackbox");
  let trackField = document.createElement("div");
  let trackFieldP = document.createElement("P");
  let trackFieldButton = document.createElement("BUTTON");
  // Fill in Button and Label properties
  trackFieldP.innerText = file.name;
  trackFieldP.style = "width: 50%;float: left;margin-top: 20px;margin-bottom: 0px;margin-left: 10px;font-size: 18px;";
  trackFieldButton.innerText = "X";
  trackFieldButton.id = trackArray.length + "trackFieldButton";
  trackFieldButton.addEventListener("click", removeTrackField);
  trackFieldButton.style = "width: 20%;text-align: center;float: right;margin-top: 10px;margin-bottom: 0px;margin-right: 10px;font-size: 20px;";
  // Fill in  TrackField properties
  trackField.class = "trackField";
  trackField.id = "" + trackArray.length + "trackField";
  trackField.style = "height: 60px;border-bottom: 1px solid grey;border: 1px solid grey;";

  // Add everything to the page and the file in the array
  trackField.appendChild(trackFieldP);
  trackField.appendChild(trackFieldButton);
  trackbox.appendChild(trackField);
  trackArray.push(file);

}

function handleArtworkFiles(files) {
  let file = files[0];
  let imageType = /^image\//;
  // see if its an image file
  if (!imageType.test(file.type)) {
    return;
  }
  // replace the current artwork image with the new one
  let reader = new FileReader();
  reader.onload = function() {
    let artworkImage = document.getElementById("artworkImage");
    let parent = artworkImage.parentNode;
    let newArtworkImage = artworkImage;
    newArtworkImage.src = reader.result;
    artworkImageParent.replaceChild(newArtworkImage, artworkImage);
  }
  reader.readAsDataURL(file);
}

function submitClicked() {
  // If Button is disabled, ignore event
  if (submitButton.className == "disabled") return;


  var data = {
    "album" : {
      "meta" : {
        "name" : nameField.value,
        "artist" : artistField.value,
        "album_length" : durationField.value,
        "album_songs" : tracksField.value,
        "album_cds" : cdsField.value,
        "price" : priceField.value
      },
      "songs" : {
        "song" : []
      }
    }
  }

  createFolder(nameField.value)
  .then(id => addAlbumDataToFolderWithID(id, JSON.stringify(data)))
  .then(/* do nothing */)
  .catch(err => console.log("Error creating folder: \n"+ err));



  // googleAuth.signIn();
  // initClient();

  // var headers = {
  //   "Authorization" : "Bearer ["+ACCESS_TOKEN+"]",
  //   "Accept" : "application/json",
  //   "Content-Type" : "application/json"
  // }
  //
  // var options = {
  //   "mimeType": "application/vnd.google-apps.folder",
  //   "name": "New Folder!"
  // }
  //
  // console.log("headers: \n"+headers);
  // fetch("https://www.googleapis.com/drive/v3/files?key=["+GAPI_KEY+"]", {
  //   method : "post",
  //   headers : headers,
  //   body : JSON.stringify(options)
  // }).then( res => console.log(res))
  // .catch( err => console.log(err));

  // console.log(data);

}
