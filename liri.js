require("dotenv").config();
let fs = require("fs");
let Spotify = require('node-spotify-api');
let keys = require("./keys.js");
let moment = require('moment');
let axios = require('axios')
moment().format();

var spotify = new Spotify(keys.spotify);

processInput(process.argv[2], process.argv.slice(3));

function processInput(command, term) {
    let result = ["Bad Input!"]
    switch (command) {
        case "concert-this":
            result = concert(term);
            break;
        case "spotify-this-song":
            result = spotifyFunction(term);
            break;
        case "movie-this":
            result = movie(term);
            break;
        case "do-what-it-says":
            result = whatItSays();
            break;
    }
}

function concert(artist) {
    let resultHeader = "Upcoming Tour Dates for " + artist.join(" ") + ":";
    let resultBody = []
    let date = "upcoming"
    let apiCall = "https://rest.bandsintown.com/artists/" + artist.join("%20") + "/events?app_id=codingbootcamp&date=" + date;

    axios.get(apiCall)
        .then(function(response) {
            for (i in response.data) {
                let data = response.data[i];
                resultBody.push({
                    Date: (moment(data.datetime, "YYYY-MM-DD")).format("MM/DD/YYYY"),
                    Location: data.venue.city + ", " + data.venue.country,
                    Venue: data.venue.name
                });
            }
            console.log();
            console.log(resultHeader);
            console.table(resultBody);
            logResults([resultHeader, resultBody]);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function spotifyFunction(song) {
    let myQuery;
    if (song.length > 0) {
        myQuery = song.join(" ");
    } else {
        myQuery = "I saw the sign"
    }
    let resultsHeader = "Spotify search results for '" + myQuery + "'.";
    let resultsBody = []
    spotify.search({ type: "track", query: myQuery, limit: 20 }, function(err, response) {
        if (err) {
            console.log(err);
            return;
        }
        for (i in response.tracks.items) {
            let data = response.tracks.items[i];
            resultsBody.push({ song: data.name, artist: data.artists[0].name, album: data.album.name, preview_url: data.preview_url })
        }
        console.log();
        console.log(resultsHeader);
        console.table(resultsBody);
        logResults([resultsHeader, resultsBody]);
    });
}

function movie(name) {
    let query;
    if (name.length > 0) {
        query = name.join("+");

    } else {
        query = "Mr.+Nobody"
    }

    let resultHeader = "OMDB search results for '" + name.join(" ") + "'.";
    let resultBody = []
    let apiCall = "https://www.omdbapi.com/?t=" + query + "&plot=short&apikey=trilogy";

    axios.get(apiCall)
        .then(function(response) {
            let imdb;
            let rotten;
            for (i in response.data.Ratings) {
                if (response.data.Ratings[i].Source === "Internet Movie Database") {
                    imdb = response.data.Ratings[i].Value;
                } else if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
                    rotten = response.data.Ratings[i].Value;
                }
            }
            resultBody.push({ year: response.data.Year, title: response.data.Title, imdbRating: imdb, rottenRating: rotten, country: response.data.Country, language: response.data.Language, plot: response.data.Plot, actors: response.data.Actors });
            console.log();
            console.log(resultHeader);
            console.log(JSON.stringify(resultBody[0], null, 2));
        })
        .catch(function(error) {
            console.log(error);
        });
}

function whatItSays() {
    console.log("Do What It Says");
    // TODO: read in the random.txt and do one of the commands stored within.
    // TODO: edit random.txt and add at least one command for movie this and concert this
}

function logResults(results) {
    console.log("TODO: Append result and command, term to log.txt (maybe add date/time when the command was entered")
}