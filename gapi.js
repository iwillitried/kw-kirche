// Client ID and API key from the Developer Console
var _CLIENT_ID = '156773008755-chs8t1iiju7uhsfn3hk991ec9bbbnd59.apps.googleusercontent.com'
var API_KEY = 'AIzaSyAeB1lf1TBN06BviOEim5dXrLsVVDoPIOI';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: _CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline';
    document.getElementById("submit").classList.remove("disabled");
    document.getElementById("submit").classList.add("button-primary");
  } else {
    authorizeButton.style.display = 'inline';
    signoutButton.style.display = 'none';
    document.getElementById("submit").classList.remove("button-primary");
    document.getElementById("submit").classList.add("disabled");
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print files.
 */
// function listFiles() {
//   gapi.client.drive.files.list({
//     'pageSize': 10,
//     'fields': "nextPageToken, files(id, name)"
//   }).then(function(response) {
//     appendPre('Files:');
//     var files = response.result.files;
//     if (files && files.length > 0) {
//       for (var i = 0; i < files.length; i++) {
//         var file = files[i];
//         appendPre(file.name + ' (' + file.id + ')');
//       }
//     } else {
//       appendPre('No files found.');
//     }
//   });
// }

// Upload Test File
function createFolder(name) {
  return new Promise(function(resolve, reject) {
    console.log("Creating new folder: "+name);

    var parentId = '';//some parentId of a folder under which to create the new folder
    var fileMetadata = {
      'name' : name,
      'mimeType' : 'application/vnd.google-apps.folder'
    };
    gapi.client.drive.files.create({
      resource: fileMetadata,
    }).then(function(response) {
      switch(response.status){
        case 200:
          var file = response.result;
          resolve(file.id);
          break;
        default:
          reject(response);
          break;
        }
    });
    console.log("bye!");
  });
}

function addAlbumDataToFolderWithID(id, data) {
  return new Promise(function(resolve, reject) {

    console.log("addAlbumDataToFolderWithID: parentID: "+ id);
    var fileContent = data; // As a sample, upload a text file.
    var file = new Blob([fileContent], {type: 'text/plain'});
    var metadata = {
        'name': 'info.txt', // Filename at Google Drive
        'mimeType': 'text/plain', // mimeType at Google Drive
        'parents': [id], // Folder ID at Google Drive
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
      console.log("Folder ID: " + xhr.response.id);
      if (xhr.response.id) {
        resolve(xhr.response.id);
      } else {
        reject(xhr.response);
      }
    };
    xhr.send(form);

  });
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {String} name Name the file should be called
 * @param {String} parentID ID String of the folder
 */
function uploadMediaFileToFolderWithID(id, file) {
  return new Promise(function(resolve, reject) {
    var metadata = {
        'name': file.name, // Filename at Google Drive
        'mimeType': file.type, // mimeType at Google Drive
        'parents': [id], // Folder ID at Google Drive
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
        console.log(xhr.response.id); // Retrieve uploaded file ID.
        if (xhr.response.id) {
          resolve(xhr.response.id);
        } else {
          reject(xhr.response);
        }
    };
    xhr.send(form);
  });


}
