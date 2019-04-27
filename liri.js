require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);
var axios = require("axios")
var artist = process.argv[3];
var inquirer = require("inquirer");
var moment = require('moment');
var fs = require('fs');
var divider = '\n \n';
var dividerTwo = '------------------------------------------------------------------------------------------\n';
//var fuzzy = require('fuzzy');
//var checkbox = require('inquirer-checkbox-plus-prompt');

inquirer
  .prompt ([
    {
      type: 'input',
      name: 'name',
      message: 'Welcome, What is your name?',
    },
    {
      type: 'list',
      name: 'userSelection',
      message: 'Hello, How can I help you?',
      choices: ['Search Concert 🎸', 'Search Song 🎵', 'Search Movie 🎞']
    }

  ]).then(function(response){
    // var userName = response.name;
    // console.log(userName);
    switch (response.userSelection) {
      case 'Search Concert 🎸':
       concert();
       break;
      case 'Search Song 🎵':
       songSpotify();
       break;
      case 'Search Movie 🎞':
       movieOmdb();
       break;
    }
  });

  function concert() {
    inquirer
    .prompt ([
      {
        type: 'input',
        name: 'userInput',
        message: 'Type the name of the concert'
      }
    ]).then(function(response) {
      var userChoice = response.userInput;

      axios.get("https://rest.bandsintown.com/artists/" + userChoice + "/events?app_id=codingbootcamp").then(
        function(response) {
          for(var i = 0; i < response.data.length; i++) {
            var concertName = "Name of the concert: " + response.data[i].venue.name;
            var time = response.data[i].datetime;
            var momentTime = "Date: " + (moment(time).format("MM/DD/YYYY"));
            var concertCity = "City where the Concert is: " + response.data[i].venue.city;
            var concertUrl = "Link for the concert: " + response.data[i].url;


            fs.appendFile('log.txt', dividerTwo + concertName + divider + momentTime + divider + concertCity + divider + concertUrl + divider + dividerTwo, function(err) {
              if (err) throw err;
              //console.log("The data was appended to the file!");
            });
            console.log("----------------------------------------------");
            console.log(concertName);
            //console.log("----------------------------------------------");
            console.log(momentTime);
            //console.log("----------------------------------------------");
            console.log(concertCity);
            //console.log("----------------------------------------------");
            console.log(concertUrl);
            console.log("----------------------------------------------");
          }
        }
      )
    });
  }

  function songSpotify() {
    inquirer
    .prompt ([
      {
        type: 'input',
        name: 'userInput',
        message: 'Type the name of the song'
      }
    ]).then(function(response){
      var userChoice = '';

      if (response.userInput !== null) {
        userChoice = response.userInput;
      } else {
        userChoice = 'The Sign';
      }

      spotify
      .search({
        type: 'track',
        query: userChoice,
        limit: 1
      }).then(function(response) {
        for (var i = 0; i < response.tracks.items.length; i++) {
          var songName = "Song Name: " + response.tracks.items[i].name;
          var songArtist = "Song Artist: " + response.tracks.items[i].artists[i].name;
          var albumName = "Album Name: " + response.tracks.items[i].album.name;
          var songUrl = "Link for the Song: " + response.tracks.items[i].href;

          fs.appendFile('log.txt', dividerTwo + songName + divider + songArtist + divider + albumName + divider + songUrl + divider + dividerTwo,
          function(err) {
            if (err) throw err;
          })
          console.log("----------------------------------------------");
          console.log(songName);
          console.log(songArtist);
          //console.log("----------------------------------------------");
          console.log(albumName);
          //console.log("----------------------------------------------");
          console.log(songUrl);
          console.log("----------------------------------------------");
        }
      }).catch(function(err) {
        console.log(err);
      });
    });
  }


  function movieOmdb() {
    inquirer
    .prompt ([
      {
        type: 'name',
        name: 'userInput',
        message: 'Type a Movie'
      }
    ]).then(function(response) {
      var userChoice = response.userInput;

      axios.get("http://www.omdbapi.com/?t=" + userChoice + "&y=&plot=short&apikey=trilogy").then(
        function(response) {
          var movieName = "Movie Name: " + response.data.Title;
          var releaseDate = "Release Date: " + response.data.Year;
          var movieRating = "Rating: " + response.data.imdbRating;
          var rottenTomatoes = "Rotten tomatoes rating: " + (JSON.stringify(response.data.Ratings[1].Value));
          var country = "Country: " + response.data.Country;
          var movieLanguage = "Language: " + response.data.Language;
          var moviePlot = "Movie Plot: " + response.data.Plot;
          var movieCast = "Movie Cast: " + response.data.Actors;

          fs.appendFile('log.txt', dividerTwo + movieName + divider + dividerTwo + releaseDate + divider + dividerTwo + movieRating + divider + dividerTwo +
          rottenTomatoes + divider + dividerTwo + country + divider + dividerTwo + movieLanguage + divider + dividerTwo + moviePlot + divider +
          dividerTwo + movieCast + divider + dividerTwo, function(err) {
            if (err) throw err;
          })
          console.log("--------------------------------------------------");
          console.log(movieName);
          console.log("--------------------------------------------------");
          console.log(releaseDate);
          console.log("--------------------------------------------------");
          console.log(movieRating);
          console.log("--------------------------------------------------");
          console.log(rottenTomatoes);
          console.log("--------------------------------------------------");
          console.log(country);
          console.log("--------------------------------------------------");
          console.log(movieLanguage);
          console.log("--------------------------------------------------");
          console.log(moviePlot);
          console.log("--------------------------------------------------");
          console.log(movieCast);
          console.log("--------------------------------------------------");
        }
      )
    })
  }
