const TelegramBot = require('node-telegram-bot-api');

// replace the values below
const token = "";   //bot token
const URL = "";     //url to rss feed
const INTERVALL = ; //update intervall in s

// Create a bot
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/ping/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "Hello";

  bot.sendMessage(chatId, resp);
});

bot.onText(/\/sub/, (msg) => {
  const user = msg.chat.id;
  addUser(String(user));
});

bot.onText(/\/unsub/, (msg) => {
  const user = msg.chat.id;
  removeUser(String(user));
});

bot.onText(/\/top/, (msg) => {
  const user = msg.chat.id;
  getTop5Entries(String(user));
});

var Watcher    = require('feed-watcher'),
feed     = URL,
interval = INTERVALL // seconds

  // if not interval is passed, 60s would be set as default interval.
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


function sendToAll (message) {
  var fs = require('fs');
  var users = fs.readFileSync('users.txt', {encoding: 'utf8', flag: 'r'}).toString().split("\n");

  for (i in users) {
    if (users[i] != "") {
      bot.sendMessage(parseInt(users[i]), message, {parse_mode : "HTML"})
    }
  }
}

function getTop5Entries (user) {
  let Parser = require('rss-parser');
  let parser = new Parser();

(async () => {
  let feed = await parser.parseURL(URL);

  resp = "<b>Last 5 chapters: </b> \n ";
  for (const [index, el] of feed.items.entries()) {
    resp += "\n<b>[" + (index+1) + "] "+ el.title + "</b> \n" + el.pubDate + "\n" + el.link + "\n";
    if ( index === 4 ) break;
  }

  bot.sendMessage(user, resp, {parse_mode : "HTML"});
})();
}

//TODO add whatever you want
function parseEntry(entry) {
  response = "<b>New Chapter: " + entry.title + "\n </b>";
  response += entry.link;
  return response;
}
