var uploading = false;
const nameField = document.getElementById("albumTitelInput");
const artistField = document.getElementById("artistField");
const priceField = document.getElementById("priceField");
const durationField = document.getElementById("durationField");
const tracksField = document.getElementById("tracksField");
const cdsField = document.getElementById("cdsField");

const submitButton = document.getElementById("submit"); // Listener to submitClicked() added in html
var trackArray = [];
var artworkFile = "";

var tasksToDo = 0;
var tasksDone = 0;

function reset() {
  nameField.value = "";
  artistField.value = "";
  priceField.value = "";
  durationField.value = "";
  tracksField.value = "";
  cdsField.value = "";
  console.log("Reset. tracks: " + trackArray.length);
  for (var i = 0; i < trackArray.length+1; i++) {
    console.log("Track: "+ i);
    removeTrackField(i);
    console.log("Removed!");
  }
  trackArray = [];
  artworkFile = "";
  document.getElementById("artworkImage").src = "artwork_placeholder.jpeg"
}

function prepareProgressBar(tasksToDo) {
  let progressBar = document.getElementById("progressBar");
  progressBar.value = 0;
  var tasksToDo = tasksToDo;
  var tasksDone = 0;
  progressBar.style = "display: inline;";
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

    trackArray.forEach((item, i) => {
      console.log("track "+ i + ":" + item.name);
    });


    trackArray.forEach((track, i) => {
      // Calculate the track length
      let reader = new FileReader();
      reader.onload = function() {
        let audio = new Audio(reader.result);
        audio.oncanplaythrough = (event) => {
          let duration = sec2time(audio.duration);
          songArray.push({
            "title" : track.name,
            "length" : duration,
            "file" : 'mp3/"'+nameField.value+'"/"'+track.name+'"'
          });
          songsCounted++;
          console.log("trackArray.length-1:" + (trackArray.length-1));
          console.log("songsCounted: "+ songsCounted);
          console.log("(trackArray.length-1) == i : " + ((trackArray.length-1) == i));
          // If this was the last song we can retrun
          if ((trackArray.length) == songsCounted) {
            console.log("resolving");
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
  if (submitButton.className == "disabled" || uploading) return;
  uploading = true;

  tasksToDo = trackArray.length + 4;

  prepareProgressBar(tasksToDo);

  createSongArray()
  .then(songArray => {
    progressDone();
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
          "song" : songArray
        }
      }
    }
    createFolder(nameField.value)
    .then(id => {
      progressDone();
      addAlbumDataToFolderWithID(id, JSON.stringify(data)).then(() => progressDone());
      uploadMediaFileToFolderWithID(id, artworkFile).then(() => progressDone());
      trackArray.forEach((track) => {
        uploadMediaFileToFolderWithID(id, track).then(() => progressDone());
      });

    })
    .then(() => {
      uploading = false;
      reset();
    })
    .catch(err => {
      uploading = false;
      reset();
      console.log("Error creating folder: \n"+ err);
    });
  });








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
