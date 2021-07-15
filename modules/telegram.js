const TelegramBot = require("node-telegram-bot-api");
const token = "1885391976:AAE4_R-CQXXFZxIuz_AxFIyF6BuTdaWV2HM";
//const token1 = '1710906682:AAFpnBEr_fTgOGsQNN0zdjDcvzqIW_SBns4';
const bot = new TelegramBot(token, { polling: true });
const main = require("../index.js");
/*********************************Telegram Bot**********************************/
//Start Messaage zum Anfangen der Kommunikation
let chatId;

bot.on("message", (msg) => {
  chatId = msg.chat.id;
  console.log(chatId);
  console.log(msg.text);
  switch (msg.text) {
    case "/temp":
      console.log("bin hier" + main.average);
      bot.sendMessage(chatId, "Die Temperatur im Mittel beträgt: " + main.average);
      break;
    case "/temp@zimmerMatic_Bot":
      bot.sendMessage(chatId, "Die Temperatur im Mittel beträgt: " + average);
      break;
    case "/status":
      bot.sendMessage(chatId, 
        "Durchschn. Temp: " + average 
      + "Temp1: " + temp
      + "Temp2: " + temp2
      + "Temp3: " + temp3
      + "Fenster: " + fensterabstand
      + "Pflanze3: " + plFeucht1
      + "Pflanze3: " + plFeucht2
      + "Pflanze3: " + plFeucht3);
      break;
    case "/akku":
      bot.sendMessage(chatId,"Anzahl Eingegangenen Sendungen mit Akku: " + anzAkk + " letze Zeit: " + timeAkk);
      break;
    case "/fs":
      currentClientsws[0].send("0");
      currentClientsws[0].send("0");
      if (fensterabstand > 13) {
        bot.sendMessage(
          chatId,
          "Das Fenster ist offen mit einem Abstand von: " + fensterabstand
        );
      } else {
        bot.sendMessage(
          chatId,
          "Das Fenster ist geschlossen mit einem Abstand von: " + fensterabstand
        );
      }
      break;
    case "/bf":
      if (fenster == true) {
        bot.sendMessage(chatId, "Das Fenster ist offen");
      } else {
        bot.sendMessage(chatId, "Das Fenster ist geschlossen");
      }
    default:
      break;
  }
});
