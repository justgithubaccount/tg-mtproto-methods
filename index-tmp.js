require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const tgToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(tgToken, { polling: true });



bot.channels.getChannels(1094834631);