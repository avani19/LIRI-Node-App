// install npm
var apiKeys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var nodeArgs = process.argv;
var action = process.argv[2];
var value = process.argv[3];
// define a variable to loop through all the argument
var nameLength = " ";
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        nameLength = nameLength + "+" + nodeArgs[i];
    } else {
        nameLength = nameLength + nodeArgs[i];
    }
}
// switch actions for diffrent functions in that make  a default which shows what to type to load perticular case
switch (action) {
    case 'my-tweets':
        getTweets();
        break;

    case 'spotify-this-song':
        // if(nameLength){
        getSpotifySong(nameLength);
        // }else{
        // getSpotifySong("The Sign by Ace of Base");
        // }
        break;

    case 'movie-this':
        if (nameLength) {
            getMovie(nameLength);
        } else {
            getMovie("Mr. Nobody");
        }
        break;

    case 'do-what-it-says':
        getWhatLIRISays();
        break;

    default:
        console.log("{Type: my-tweets(To see last 20 Tweets), spotify-this-song(To get the info of the song), movie-this(To get the detail of movie), do-what-it-says}");
        break;
}
// to load tweets
function getTweets() {
    // set a new variabale to the twitter object
    var client = new Twitter(apiKeys.twitterKeys);
    // variable to user name and number of tweets
    var user = {
        screen_name: 'GAvaniR',
        count: 20
    };
    client.get('statuses/user_timeline', user, function(error, tweets, response) {

        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                console.log("<----------My tweets---------->");
                console.log(i + " " + tweets[i].text + " " + tweets[i].created_at);
                console.log("<----------End of the tweets---------->");
                var tweetList = {
                    Number: i,
                    Tweet: tweets[i].text,
                    Time: tweets[i].created_at
                }
                fs.appendFile('log.txt', JSON.stringify(tweetList));
                fs.appendFile('log.txt', "<------End of the tweets---------->");
            }
        } else {
            console.log('error!');
        }
    });

}
// spotify function
function getSpotifySong(mySong) {    
    // select a type and query
    if(mySong.length == 1){
      mySong = "Ace of Base - I saw the sign"
    }

    spotify.search({ type: 'track', query: mySong }, function(error, data) {
        if (!error) {
            // make a for loop to get a song detail
            for (var i = 0; i < 1; i++) {
                var songInfo = data.tracks.items[i];
                // console log artist, song, preview URL and album
                console.log("Artist: " + songInfo.artists[0].name);
                console.log("Song: " + songInfo.name);
                console.log("Preview URL: " + songInfo.preview_url);
                console.log("Album: " + songInfo.album.name);
                console.log("-----------------------");
                // create and object to append it on log.txt
                var songList = {
                    Artist: songInfo.artists[0].name,
                    Name: songInfo.name,
                    PreviewURL: songInfo.preview_url,
                    Album: songInfo.album.name
                }
                fs.appendFile('log.txt', "<----------spotify-this-song---------->");
                fs.appendFile('log.txt', JSON.stringify(songList));
                fs.appendFile('log.txt', "<----------End of the Song List---------->");
            }
        } else {
            console.log('Error!!');
        }
    });
}
// make a function to get movie details
function getMovie(movieName) {
    // var movieName = " ";
    var movieUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&tomatoes=true&r=json';

    // how to take an integer value.
    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    // for (var i=3; i<nodeArgs.length; i++){
    //   if (i>3 && i< nodeArgs.length){
    //   movieName = movieName + "+" + nodeArgs[i];
    // }else {
    //   movieName = movieName + nodeArgs[i];
    //   }
    // }
    // request for movie URL and get the response
    request(movieUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // store JSON as an variable
            var body = JSON.parse(body);
            // console log data as per required using variable body
            console.log("<---------------------->");
            console.log("Title: " + body.Title);
            console.log("Released: " + body.Released);
            console.log("IMDB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating.: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL.: " + body.tomatoURL);
            console.log("<---------------------->");
            // make an object to store the data and append it to log.txt
            var movieList = {
                Title: body.Title,
                Released: body.Released,
                IMDBRating: body.imdbRating,
                Country: body.Country,
                Language: body.Language,
                Plot: body.Plot,
                Actors: body.Actors,
                RottenTomatoesRating: body.tomatoRating,
                RottenTomatoesURL: body.tomatoURL
            }
            fs.appendFile('log.txt', "<--------------------->");
            fs.appendFile('log.txt', JSON.stringify(movieList));
            fs.appendFile('log.txt', "<--------------------->");
        } else {
            console.log("Error!!");
        }
        // if no movie name is given type Mr. Nobody as a default movie 
        if (movieName === " ") {
            getMovie("Mr. Nobody");
            console.log("<----------------------->");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //adds text to log.txt
            fs.appendFile('log.txt', "<----------------------->");
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFile('log.txt', "It's on Netflix!");
        }

    });
}
// if get what it sayes typed read the random.txt file and use as a spotify command
function getWhatLIRISays() {
    fs.readFile('random.txt', "utf8", function(error, data) {
        var definedTxt = data.split(',');

        getSpotifySong(definedTxt[1]);
    });
}
