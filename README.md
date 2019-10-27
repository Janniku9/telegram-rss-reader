<h1 align="center">Telegram RSS Reader</h1>

<div align="center">

a Telegram Bot that watches one RSS feed (or more) and sends notifications on updates

<p align="center">
    <img src="https://i.imgur.com/aMlDmBF.png" width="400"/>
</p>

</div>

## Install

In [bot.js](https://github.com/Janniku9/telegram-rss-reader/blob/master/bot.js), fill in the [Bot Token](https://core.telegram.org/bots), the Urls of the feeds you want to track and the update Interval in seconds. 

```js
const token = "";   // bot token from botfather
const URLS = [""];     // array of urls to rss feeds
const INTERVALL = 100; // update intervall in s
```

```bash
npm install
```

## Usage

```bash
npm start
```

### commands
```
\sub    -> enables notifications
\unsub  -> disables notifications
\feeds  -> shows all feeds
\top x  -> shows last 5 items from feed x (x is the number of the feed)
```

<p align="center">
    <img src="https://i.imgur.com/aMlDmBF.png" width="400"/>
</p>
</div>
