mastery-bot
===========

[![Travis](https://img.shields.io/travis/Crecket/mastery-bot.svg)](https://travis-ci.org/Crecket/mastery-bot) [![Beerpay](https://beerpay.io/Crecket/mastery-bot/badge.svg?style=beer-square)](https://beerpay.io/Crecket/mastery-bot)   [![Beerpay](https://beerpay.io/Crecket/mastery-bot/make-wish.svg?style=flat-square)](https://beerpay.io/Crecket/mastery-bot?focus=wish)

A reddit bot ([/u/mastery_bot](https://www.reddit.com/user/mastery_bot/)) which responds to username mentions with information about a summoner's mastery points. 

All data is fetched from https://www.masterypoints.com.

## How does it work
When a user mentions the bot's username (/u/mastery_bot or u/mastery_bot) the bot automatically receives a PM. 

Every X amount of seconds the bot checks for new unread messages using the [snoowrap](https://github.com/not-an-aardvark/snoowrap) library.

Next we parse the comment's contents and look for a pattern we recognize. The most common command is /u/mastery_bot summoner name / server. 

A response is generated and stored in a SQLITE database with status `sent` set to 0

During all this we check the database for rows with status == 0. Once we find one we attempt to respond to the original comment using the generated response.

## Possible commands
- Summoner profile:
  - Format: `/u/mastery_bot <summoner_name> / <server>`
- Champion highscores:
  - Format: `/u/mastery_bot @champion <champion name> / <server>`
  - You can enter a normal server or use `any` to receive a highscore across all servers

## Installation
1. Clone or download this repo
2. Install the required libraries `npm install`
3. Create a config file at `src/config/config` by copying the template
4. Edit the new config file and enter your reddit account information and reddit application credentials.
5. Run the server using `npm start`

## Command line options
- `-g` or `--gui` will show a basic table with statistics about the server. By default the server will display a endless stream of console logs

## Tests
Right now only some very basic tests have been added. I'll be adding more in the feature to test the database, API calls and fetch/response objects.

Run the tests using `npm test`

## Issues
- Setting the user limit to more than 1 will cause the bot to respond to reply multiple times to the same comment. This should be solved by combining multiple user templates into 1 comment.
- The main isReady() function should be re-written to use promisses 
