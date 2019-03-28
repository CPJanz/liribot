require("dotenv").config();
let fs = require("fs");
let Spotify = require('node-spotify-api');
let keys = require("./keys.js");
let moment = require('moment');
let axios = require('axios');

var spotify = new Spotify(keys.spotify);

processInput(process.argv[2], process.argv.slice(3));

function processInput(command, term) {
    switch (command) {
        case "concert-this":
            concert(term);
            break;
        case "spotify-this-song":
            spotifyFunction(term);
            break;
        case "movie-this":
            movie(term);
            break;
        case "do-what-it-says":
            whatItSays(term);
            break;
        default:
            console.log("Bad Input! Valid commands are 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'");
    }
}

function concert(artist) {
    let resultHeader = "Upcoming Tour Dates for " + artist.join(" ") + ":";
    let resultBody = []
    let logBody = [getTimestamp(), resultHeader]
    let date = "upcoming"
    let apiCall = "https://rest.bandsintown.com/artists/" + artist.join("%20") + "/events?app_id=codingbootcamp&date=" + date;
    if (artist.length > 0) { //verifies that an artist was passed
        axios.get(apiCall)
            .then(function(response) {
                if (response.data.length > 0) { //Verifies that the passed artist has upcoming tour dates
                    for (i in response.data) { //Formats tour date data
                        let data = response.data[i];
                        let showDate = (moment(data.datetime, "YYYY-MM-DD")).format("MM/DD/YYYY");
                        resultBody.push({
                            Date: showDate,
                            Location: data.venue.city + ", " + data.venue.country,
                            Venue: data.venue.name
                        });
                        logBody.push("Date: " + showDate + " Location: " + data.venue.city + ", " + data.venue.country + " Venue: " + data.venue.name);
                    }
                } else {
                    resultBody.push({ TourDates: "None" });
                }
                console.log();
                console.log(resultHeader);
                console.table(resultBody);
                logResults(logBody);
            })
            .catch(function(error) {
                console.log(error);
            });
    } else {
        console.log("You must pass an artist/band in order to get tour data.")
    }
}

function spotifyFunction(song) {
    let myQuery;
    if (song.length > 0) { // Checks for song query being passed.
        myQuery = song.join(" ");
    } else {
        myQuery = "I saw the sign"
    }
    let resultsHeader = "Spotify search results for '" + myQuery + "'.";
    let resultsBody = []
    let logBody = [getTimestamp(), resultsHeader];
    spotify.search({ type: "track", query: myQuery }, function(err, response) {
        if (err) {
            console.log(err);
            return;
        }
        for (i in response.tracks.items) { //Formats song data
            let data = response.tracks.items[i];
            let artists = []
            for (i in data.artists) {
                artists.push(data.artists[i].name);
            }
            resultsBody.push({ song: data.name, artist: artists.join(", "), album: data.album.name, preview_url: data.preview_url });
            logBody.push("Song: " + data.name + " Artist: " + artists.join(", ") + " Album: " + data.album.name + " URL: " + data.preview_url);
        }
        console.log();
        console.log(resultsHeader);
        console.table(resultsBody);
        logResults(logBody);
    });
}

function movie(name) {
    let query;
    if (name.length > 0) { // Checks for movie name being passed
        query = name.join("+");

    } else {
        query = "Mr.+Nobody"
    }

    let resultHeader = "OMDB search results for '" + name.join(" ") + "'.";
    let resultBody = []
    let logBody = [getTimestamp(), resultHeader];
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
            //resultBody.push({ year: response.data.Year, title: response.data.Title, imdbRating: imdb, rottenRating: rotten, country: response.data.Country, language: response.data.Language, plot: response.data.Plot, actors: response.data.Actors });
            resultBody = ["year: " + response.data.Year, "title: " + response.data.Title, "imdbRating: " + imdb, "rottenRating: " + rotten, "country: " + response.data.Country, "language: " + response.data.Language, "plot: " + response.data.Plot, "actors: " + response.data.Actors]
            logBody.push("year: " + response.data.Year, "title: " + response.data.Title, "imdbRating: " + imdb, "rottenRating: " + rotten, "country: " + response.data.Country, "language: " + response.data.Language, "plot: " + response.data.Plot, "actors: " + response.data.Actors)

            // Print output is slightly different from the other two so we're not using output results.
            console.log();
            console.log(resultHeader);
            for (i in resultBody) {
                console.log(resultBody[i]);
            }
            logResults(logBody);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function whatItSays(input) {
    console.log("Do What It Says");
    if (input.length > 0) { // Checks for arguments being passed to the function and denies the output
        console.log("'do-what-it-says' does not take an argument. Please try again.")
    } else {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) { return console.log(error); };

            let commandList = data.split(";"); // Read in from random.txt and turn it to an array of objects with command and input
            randomCommand = commandList[Math.floor(Math.random() * commandList.length)].split(",");
            let searchTerms = randomCommand.slice(1).join(" ").replace(/"/g, "").split(" "); //Cleans the randomly chosen input.
            console.log("Executing a " + randomCommand[0] + " command. Searching for '" + searchTerms.join(" ") + "'");
            processInput(randomCommand[0], searchTerms);
        });
    }
}

//--------------------------------------
//
//        LOG PRINTING HELPERS
//
//---------------------------------------


// Takes in data and writes it to the log file
function logResults(results) {
    fs.appendFile("log.txt", results[0] + "\n", function(err) {
        if (err) {
            return console.log(err);
        }
        let remainder = results.slice(1)
        if (remainder.length > 0) {
            logResults(remainder);
        }
    });
}

// Formats a timestamp and sends it to be written to the log file
function getTimestamp() {
    return moment().format("LLLL") + " --------------------------------------------------- \n";
}