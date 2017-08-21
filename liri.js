//load
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Get twitter keys and secrets from keys.js 
var loadKeys = require('./.gitignore/keys.js');
//Load twitter keys into variables
var twitKey = loadKeys.twitterKeys;
var spotId = loadKeys.spotifyKeys;
var client = new Twitter(twitKey);
var spotifyApi = new Spotify(spotId);
//get request node.js library
var request = require('request');
//get fs library
var fs = require('fs');

var userInput = "";
var movTitle = "";
var songTitle = "";
var tomatoURL = "";

userKeyword = process.argv[2];
inputHandler(process.argv,userKeyword);

function inputHandler(arguments,command){
    switch(userKeyword){
    case "get-tweets":
    myTweets();
    break;

    case "movie-this":
        movTitle = process.argv.splice(3, process.argv.length).join("%20");
        if(movTitle === ""){
            movTitle = "Mr%20Nobody";
        }
        tomatoURL = movTitle.split('%20').join('_').toLowerCase();
        var queryURL = "http://www.omdbapi.com/?t=" + movTitle + "&y=&plot=short&apikey=40e9cece";
        request(queryURL,function(error,response,body){
            if(error){
                //Use variable error, because it has the error code
                console.log(error);
            }
            else{
                //log all relevant details in console
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Released Date: " + JSON.parse(body).Date);                
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Country Filmed: " + JSON.parse(body).Country);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes: https://www.rottentomatoes.com/m/" + tomatoURL + "\n");
                //Add to log.txt
    fs.appendFile("Movie Title: " + JSON.parse(body).Title + '.  ' + "Released Date: " + JSON.parse(body).Date + '.  ' + "IMDB Rating: " + JSON.parse(body).imdbRating + '.  ' + "Country Filmed: " + JSON.parse(body).Country + '.  ' + "Plot: " + JSON.parse(body).Plot + '.  ' + "Actors: " + JSON.parse(body).Actors + '.  ' +"Rotten Tomatoes: https://www.rottentomatoes.com/m/" + tomatoURL + '.  ');
            }
        });
    break;

    case "spotify-this-song":
            songTitle = process.argv.splice(3, process.argv.length).join(" ");
            if(songTitle === ""){
                songTitle = "the sign ace of base";
            }
            console.log(songTitle);
            mySpot(songTitle);
    break;
        }

}

function myTweets(){
var params = {screen_name: 'grant_chanrz'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for(i=0;i<tweets.length;i++){ 
    console.log("\n" + tweets[i].text);
    console.log("Tweet created on: " + tweets[i].created_at + "\n");
        //Add to log.txt
    fs.appendFile('log.txt', tweets[i].text + ' ' +  'Tweet created on:' + tweets[i].created_at + '.  ');
    }
  }
  else{
      console.log(error);
}
})
};

function mySpot(songTitle){
// spotifyApi.searchTracks(songTitle)
//   .then(function(data) {
//     console.log('Searched'+ songTitle, data.body);
//   }, function(err) {
//     console.error(err);
//   });
spotifyApi.search({ type: 'track', query: songTitle }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var songData = data.tracks.items[0];
            var songResult = console.log("\nArtist(s): " + songData.artists[0].name);
            console.log("Song Title: " + songData.name);
            console.log("Preview URL: " + songData.preview_url);
            console.log("Album Name: " + songData.album.name + "\n");
            //         // Add to log.txt
        fs.appendFile('log.txt', "\nArtist(s): " + songData.artists[0].name + '/n' + "Song Title: " + songData.name + '/n' + "Preview URL: " + songData.preview_url + "Album Name: " + songData.album.name + "\n");
}
})
};