
const nameField = document.getElementById("albumTitelInput");
const artistField = document.getElementById("artistField");
const priceField = document.getElementById("priceField");
const durationField = document.getElementById("durationField");
const tracksField = document.getElementById("tracksField");
const cdsField = document.getElementById("cdsField");

const submitButton = document.getElementById("submit") // Listener to submitClicked() added in html


function submitClicked() {
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
