/*
  To get everything running follow these 2 simple Steps
*/

//import node-telegram-bot-api
const TelegramBot = require('node-telegram-bot-api');

/*
  *TODO Step1 : Change these values

  *Token is the token you get from botfather
  *URL is the Url of the rss-feed you want to watch
  *Intervall is the amount of seconds the watcher sleeps
*/
const token = "";   //bot token
const URL = "";     //url to rss feed
const INTERVALL = 60; //update intervall in s

// Create a bot
const bot = new TelegramBot(token, {polling: true});

//simple ping command that reurns pong
bot.onText(/\/ping/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "pong";

  bot.sendMessage(chatId, resp);
});

//this command is used to subscribe to the feed
//only subscribed users will get notifications on new entries
bot.onText(/\/sub/, (msg) => {
  const user = msg.chat.id;
  addUser(String(user));
});

//this command is used to unsubscribe to the feed
bot.onText(/\/unsub/, (msg) => {
  const user = msg.chat.id;
  removeUser(String(user));
});

//this command returns the last 5 entries from the feed
bot.onText(/\/top/, (msg) => {
  const user = msg.chat.id;
  getTop5Entries(String(user));
});

//create users.txt if it doesnt exist yet
var fs = require('fs');
if (!fs.existsSync('users.txt')) {
    fs.appendFile('users.txt', '');
    console.log('created users.txt');
}

//init new rss watcher
var Watcher    = require('feed-watcher'),
feed     = URL,
interval = INTERVALL // seconds

  // if no interval is passed, 60s would be set as the default interval.
  var watcher = new Watcher(feed, interval)

  // Check for new entries every n seconds.
  watcher.on('new entries', function (entries) {
    entries.forEach(function (entry) {
      sendToAll(parseEntry(entry));
    })
  })

  // Start watching the feed.
  watcher
    .start()
    .then(function (entries) {
      //console.log(entries)
    })
    .catch(function(error) {
      //console.error(error)
    })

//adds userId to users.txt
function addUser (user) {
  var fs = require('fs');
  var users = fs.readFileSync('users.txt', {encoding: 'utf8', flag: 'r'}).toString().split("\n");

  if (users.indexOf(user) > -1) {
    bot.sendMessage(parseInt(user), "Already subscribed");
    console.log("sub: " + user + " is already subscribed");
  } else {
    fs.writeFileSync ('users.txt', user + "\n",{encoding: 'utf8', flag: 'a'});
    bot.sendMessage(parseInt(user), "Successfully subscribed");
    console.log("sub: " + user + " just subscribed");
  }
}

//removes userId from users.txt
function removeUser (user) {
  var fs = require('fs');
  var users = fs.readFileSync('users.txt', {encoding: 'utf8', flag: 'r'}).toString().split("\n");
  fs.writeFileSync('users.txt', "", {encoding: 'utf8', flag: 'w'});
  for (i in users) {
    u = users[i];
    if (String(user) != String(u)) {
      fs.writeFileSync('users.txt', u + "\n",{encoding: 'utf8', flag: 'a'});
    }
  }

  bot.sendMessage(parseInt(user), "Successfully unsubscribed");
  console.log("unsub: " + user + " just unsubscribed");
}


//gets all users from users.txt and sends a message to All
function sendToAll (message) {
  var fs = require('fs');
  var users = fs.readFileSync('users.txt', {encoding: 'utf8', flag: 'r'}).toString().split("\n");

  for (i in users) {
    if (users[i] != "") {
      bot.sendMessage(parseInt(users[i]), message, {parse_mode : "HTML"})
    }
  }
}

//get last 5 item of the feed
function getTop5Entries (user) {
  let Parser = require('rss-parser');
  let parser = new Parser();

(async () => {
  let feed = await parser.parseURL(URL);

  resp = "<b>Last 5 updates: </b> \n ";
  for (const [index, el] of feed.items.entries()) {
    resp += "\n<b>[" + (index+1) + "] "+ el.title + "</b> \n" + el.pubDate + "\n" + el.link + "\n";
    if ( index === 4 ) break;
  }

  bot.sendMessage(user, resp, {parse_mode : "HTML"});
})();
}

/*

  *TODO STEP 2 : customize response message
  *This is what the bot is going to say whenever a new entry in the feed is found
  with entry.title for example you can access the title field of a item in the feed
*/
function parseEntry(entry) {
  response = "<b>New Update: " + entry.title + "\n </b>";
  response += entry.link;
  return response;
}
