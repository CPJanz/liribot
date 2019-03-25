require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");

var moment = require('moment');
moment().format();

var spotify = new Spotify(keys.spotify);


function processInput(command, term) {
    let result = ["Bad Input!"]
    switch (command) {
        case "concert-this":
            result = concert(term);
            break;
        case "spotify-this-song":
            result = spotify(term);
            break;
        case "movie-this":
            result = movie(term);
            break;
        case "do-what-it-says":
            result = whatItSays();
            break;
    }
    for (i in result) {
        console.log(result[i]);
    }
}

function concert(artist) {
    console.log("Concert This");
    let apiCall = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    // TODO: Using bands in town api get the following for all responses
    // TODO: name of venue
    // TODO: location of venue
    // TODO: date of event format as MM/DD/YYYY using moment
}

function spotify(song) {
    let result = { artist, name, link, album }
    if (song) {
        // TODO: Make a call for the provided song. Format the result.
    } else {
        // TODO: Make a call for the song The Sign by ace of base. Format the result.
    }

    console.log("Song:", result.song);
    console.log("Artist:", name);
    console.log("Album:", album);
    console.log("Preview", link);
}

function movie(name) {
    let result = { title, year, imdbRating, rottenRating, country, language, plot, actors: [] }
    if (name) {
        // TODO: make a call to omdb with the name of the movie. return the formatted results
    } else {
        // TODO: make a call to omdb with Mr Nobody as the movie. Return the formatted results.
    }

    let formattedResult = ["Movie: " + result.title, result.year, "Cast:"]
    for (actor in result.actors) {
        formattedResult.push(("-" + result.actors[actor]));
    };
    formattedResult.push(("Plot:", result.plot));
    formattedResult.push(("IMDB Rating:", result.imdbRating));
    formattedResult.push(("Rotten Tomatoes:", result.rottenRating));

    return formattedResult;
}

function whatItSays() {
    console.log("Do What It Says");
    // TODO: read in the random.txt and do one of the commands stored within.
    // TODO: edit random.txt and add at least one command for movie this and concert this
}