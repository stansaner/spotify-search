var clientId = "3903dc1b09cd47ae8c1bfb4990969b30";
var clientSecret = "1ec45ae9502c46db84bf1df9f682dd3e";
var postBody = { grant_type: "client_credentials" };
var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");
urlencoded.append("client_id", "3903dc1b09cd47ae8c1bfb4990969b30");
urlencoded.append("client_secret", "1ec45ae9502c46db84bf1df9f682dd3e");
var searchInput = $(".form-input");
var searchButton = $(".search-button");
var jumbotron = $("#display-artist");
var displayCards = $('#display-songs');

// This function will bring up a QR code which will link to a google search
// of the artist as per user input
function getQRCode(artistName) {
  var data = artistName;
  var fmt = "png";
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/qrcode?data=" + data + "&format=" + fmt,
    headers: { "X-Api-Key": "ZdYI+Lj/vMMSzi+ktewh/w==89dSZH02W3eHyFfr" },
    contentType: "application/json",
    success: function (result) {
      // console.log("test", result);

      var mainBody = $("body");

      mainBody.append(`
            <div>
                <h3>QR CODE</h3>
               
               <p><img src="data:image/png;base64,${result}" alt="QR code" /></p>
               
            </div> 
            `);
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}

// This is to get the access token needed to grab the data for the two api's
function getAccessToken() {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: urlencoded,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data.access_token;
    });
}

// using the artist id to get the top tracks
function getTracks(id, token, artistName) {
  var artistID = id;
  displayCards.html('');
  fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=GB`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("get tracks", data);

      
      displayCards.append(`
      <h3 class="d-flex flex-wrap">Top Tracks</h3>
      <div class="display-songs d-flex flex row">
      </div>
      `)

      // For loop starts here:
      var trackArray = data.tracks;
      // console.log('track array', trackArray);
      
      for(var track = 0; track < trackArray.length; track++) {

        var trackImage = data.tracks[track].album.images[1].url;
        console.log("get image", data.tracks[track].album.images[1]);
  
        var trackAlbum = data.tracks[track].album.name;
        console.log("album name", data.tracks[track].album.name);
  
        var trackName = data.tracks[track].name;
        console.log("song name", data.tracks[track].name);
        displayCards.append(`
        <div class="song-card shadow=lg p-3 rb-5 rounded">
          <img class="song-image card-img-top src=url(${trackImage})>
          <div class="card-body">
            <h3>${trackName}</h3>
            <p>Album: ${trackAlbum}</p>
          </div>
        </div> 
        `)

      }


      getQRCode(artistName);
      return data;
    });
}


// 2 step process
// Step 1: obtain artist id
// Step 2: use artist id to get top tracks for the searched artist
// this will allow us to grab the artist id
function getArtists(event) {
  var artist = '';

  // var keyCode = event.keyCode;
  console.log("event", event);
  var artist = searchInput.val().trim();
  console.log("search input", artist);
  jumbotron.html('');

  if (artist) {
    getAccessToken().then((token) => {
      fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log("get artists", data);

          console.log("id", data.artists.items[0].id);
          var artistNameID = data.artists.items[0].id;

          console.log("name", data.artists.items[0].name);

          var artistImage = data.artists.items[0].images[1].url;
          console.log('artist image', artistImage);

          var genre = data.artists.items[0].genres[0];
          console.log('genre', genre);

          //Add artist name, genre and image in jumbotron
          jumbotron.append(`
          <div class="mt-3 jumbotron jumbotron-fluid p-4">
            <div class="container">
              <h1 class="display-4 row">${artist}</h1>
              <img class="row artist-image" src=${artistImage}>
              <p class="row artist-genre">${genre}</p>
            </div>
          </div>
          `);

          getTracks(artistNameID, token, artist);
        });
    });
  }
}

// getArtists();

// getQRCode(artistName);
// function fetchArtist(event) {
//   var keyCode = event.keyCode;
//   var searchText = searchInput.val().trim();

//   if (keyCode === 13 && searchText) {
//     $.get(`https://www.omdbapi.com/?apikey=973e914e&s=${searchText}`).then(
//       function (data) {
//         console.log(data);
//         displayMatches(data.Search);
//         searchInput.val("");
//       }
//     );
//   }
// }

function init() {
  // searchInput.keydown(getArtists);
  searchButton.click(getArtists);
  console.log("start point");
}

init();

// Cards section:
// h2 heading - Top Tracks:
// Cards to display song name, album name and album image
