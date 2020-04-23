var uploading = false;
const nameField = document.getElementById("albumTitelInput");
const artistField = document.getElementById("artistField");
const priceField = document.getElementById("priceField");
const durationField = document.getElementById("durationField");
const tracksField = document.getElementById("tracksField");
const cdsField = document.getElementById("cdsField");

const submitButton = document.getElementById("submit"); // Listener to submitClicked() added in html
var trackArray = [];
var artworkFile = null;

var tasksToDo = 0;
var tasksDone = 0;

function reset() {
  nameField.value = "";
  artistField.value = "";
  priceField.value = "";
  durationField.value = "";
  tracksField.value = "";
  cdsField.value = "";
  document.getElementById("trackbox").innerHTML = "";
  trackArray = [];
  artworkFile = "";
  document.getElementById("artworkImage").src = "artwork_placeholder.jpeg"
}

function uploadCompleted() {
  showProgressMessage("Alles geschafft!");
  uploading = false;
  reset();
}

// Checks if all the field are filled in
// Return nil if everything is there
// Otherwise returns a String with the missing component
function checkIfReadyForUpload() {
  if (!nameField.value) return "Albumtitel";
  if (!artistField.value) return "Albumkünstler";
  if (!priceField.value) return "Preis";
  if (!durationField.value) return "Album Länge";
  if (!tracksField.value) return "Anzahl der Titel";
  if (!cdsField.value) return "Anzahl der CDs";
  if (!artworkFile) return "Albumcover";
  if (!trackArray[0]) return "Audio Datei(en)";
  return;
}
function showProgressMessage(message) {
  let progressLabel = document.getElementById("progressLabel");
  progressLabel.style.display = "inline";
  progressLabel.innerHTML = message;
  console.log("Showing message: " + message);
}

function hideProgressLabel() {
  progressLabel = document.getElementById("progressLabel").style.display = "none";
}

function prepareProgressBar(tasksToDo) {
  let progressBar = document.getElementById("progressBar");
  progressBar.value = 0;
  var tasksToDo = tasksToDo;
  var tasksDone = 0;
  progressBar.style = "display: block;";
}

function progressDone() {
  let progressBar = document.getElementById("progressBar");
  tasksDone++;
  progressBar.value = (tasksDone/tasksToDo)*100;
  if (tasksDone == tasksToDo) {
    progressBar.style = "display: none;";
  }
}


function sec2time(timeInSeconds) {
    var result = "";
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(minutes, 2) + ':' + pad(seconds, 2)
}


function createSongArray() {
  return new Promise(function(resolve, reject) {


    var songsCounted = 0;
    let songArray = [];

    // let nameArray = []; // Holds the names of the tracks displayed to the user (whereas track.name is the file name the mp3 gets saved as)
    let allTrackFields = document.getElementsByClassName("trackField");
    for (var i = 0; i < allTrackFields.length; i++) {
      trackArray[i].displayName = allTrackFields[i].querySelector("input").value;
    }
    // trackArray.forEach((item, i) => {
    //   console.log("track "+ i + ":" + item.name);
    // });


    trackArray.forEach((track, i) => {
      // Calculates the audio track length (duration)
      //
      // first read the song file into memory
      let reader = new FileReader();
      reader.onload = function() {
        // adter loading audio track, let Audio() parse it
        let audio = new Audio(reader.result);
        audio.oncanplaythrough = (event) => {
        // when it is parsed we can ask for the audio tracks duration
          let duration = sec2time(audio.duration);
          songArray.push({
            "title" : track.displayName+"",
            "length" : duration+"",
            "file" : `mp3/${nameField.value}/${track.name}`
          });
          // count how many tracks have been evaluated so far
          songsCounted++;
          // If this was the last song we can retrun
          if ((trackArray.length) == songsCounted) {
            return resolve(songArray);
          }
        }
      }
      reader.readAsDataURL(track);
    });
  });
}

function removeTrackField(e) {

  var trackNumber;
  if (e.target) {
    trackNumber = e.target.id.charAt(0)
  } else {
    trackNumber =  e;
  }

  console.log("Removing track: "+trackNumber);

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
  let trackFieldFilePathP = document.createElement("p");
  let trackFieldFilePathLabel = document.createElement("label");
  let trackFieldNameInput = document.createElement("input");
  let trackFieldNameLabel = document.createElement("label");
  let trackFieldButton = document.createElement("button");
  // Fill in Button and Label properties
  trackFieldFilePathP.innerText = file.name;
  trackFieldFilePathLabel.innerHTML = "Datei:"
  trackFieldNameInput.value = "Track "+(trackArray.length+1);
  trackFieldNameLabel.innerHTML = "Name:";
  // trackFieldFilePathP.style = "width: 50%;float: left;margin-top: 20px;margin-bottom: 0px;margin-left: 10px;font-size: 18px;";
  trackFieldButton.innerText = "X";
  trackFieldButton.id = trackArray.length + "trackFieldButton";
  trackFieldButton.addEventListener("click", removeTrackField);
  // trackFieldButton.style = "width: 20%;text-align: center;float: right;margin-top: 10px;margin-bottom: 0px;margin-right: 10px;font-size: 20px;";
  // Fill in  TrackField properties
  trackField.classList.add("trackField");
  trackField.id = "" + trackArray.length + "trackField";
  // trackField.style = "height: 60px;border-bottom: 1px solid grey;border: 1px solid grey;";

  // Add everything to the page and the file in the array
  trackField.appendChild(trackFieldNameLabel);
  trackField.appendChild(trackFieldFilePathLabel);
  trackField.appendChild(trackFieldButton);
  trackField.appendChild(trackFieldNameInput);
  trackField.appendChild(trackFieldFilePathP);
  trackField.file = file;


  trackbox.appendChild(trackField);
  trackArray.push(file);
  console.log("Pushed "+file.name+" on trackArray");
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
  artworkFile = file;
  reader.onload = function() {
    let artworkImage = document.getElementById("artworkImage");
    let parent = artworkImage.parentNode;
    let newArtworkImage = artworkImage;
    newArtworkImage.src = reader.result;
    parent.replaceChild(newArtworkImage, artworkImage);
  }
  reader.readAsDataURL(file);
}

function submitClicked() {
  // If Button is disabled, ignore event
  if (submitButton.className == "disabled" || uploading) return
  let missing = checkIfReadyForUpload();
  if (missing) {
    showProgressMessage("Bitte füge noch ein: " + missing);
    return;
  }
  hideProgressLabel();
  uploading = true;
  tasksToDo = trackArray.length + 4;
  let uploadedCount = 0;
  let uploadsToDo = trackArray.length + 1;
  prepareProgressBar(tasksToDo);
  showProgressMessage("Bereite Audio Dateien vor...")

  createSongArray()
  .then(songArray => {
    progressDone();
    showProgressMessage("Erstelle Ordner: " + nameField.value)

    var data = {
      "meta" : {
        "name" : nameField.value,
        "artist" : artistField.value,
        "artwork" : `mp3/${nameField.value}/${artworkFile.name}`,
        "album_length" : durationField.value,
        "album_songs" : tracksField.value,
        "album_cds" : cdsField.value,
        "price" : priceField.value
      },
      "songs" : {
        "song" : songArray
      }
    }

    createFolder(nameField.value)
    .then(id => {
      showProgressMessage("Lade Dateien hoch " + uploadedCount + " von " + uploadsToDo + "...");
      progressDone();
      addAlbumDataToFolderWithID(id, JSON.stringify(data)).then(() => progressDone());
      uploadMediaFileToFolderWithID(id, artworkFile).then(() => {
        progressDone();
        uploadedCount++;
        showProgressMessage("Lade Dateien hoch " + uploadedCount + " von " + uploadsToDo + "...");
        if (uploadedCount == uploadsToDo) uploadCompleted();
      });
      trackArray.forEach((track) => {
        uploadMediaFileToFolderWithID(id, track).then(() => {
          uploadedCount++;
          showProgressMessage("Lade Dateien hoch " + uploadedCount + " von " + uploadsToDo + "...");
          if (uploadedCount == uploadsToDo) uploadCompleted();
          progressDone()
        });
      });

    })
    .then(() => {})
    .catch(err => {
      console.log("Error creating folder: \n"+ err);
    });
  });
}
