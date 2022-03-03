const TelegramBot = require("node-telegram-bot-api");
const token = "1885391976:AAE4_R-CQXXFZxIuz_AxFIyF6BuTdaWV2HM";
//const token1 = '1710906682:AAFpnBEr_fTgOGsQNN0zdjDcvzqIW_SBns4';

const bot = new TelegramBot(token, { polling: true });
const main = require("../index.js");
const pflanzen = require("./pflanzen");
const temp = require("./temp");
const trad = require("../modules/tradfri")


/*********************************Telegram Bot**********************************/
//Start Messaage zum Anfangen der Kommunikation
let chatId;

bot.on("message", (msg) => {
  chatId = msg.chat.id;
  console.log(chatId);
  console.log(msg.text);
  switch (msg.text) {
    case "/temp":
      bot.sendMessage(chatId, "Die Temperatur im Mittel beträgt: " + main.average);
      break;
    case "/temp@zimmerMatic_Bot":
      bot.sendMessage(chatId, "Die Temperatur im Mittel beträgt: " + average);
      break;
    case "/status":
      pflanzen.botSendStatus();
      temp.botSendStatus();
      break;
    case "/STOP":
      trad.fetchSteckdose("OFF")
      break;
    default:
      break;
  }
});

exports.sendM = function (s) {
  bot.sendMessage(chatId, s);
}
