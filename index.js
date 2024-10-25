const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { instagram } = require("nayan-media-downloader");
const { tikdown } = require("nayan-media-downloader");

const token = "8154059770:AAEcRDb9261RdzTZ27M2ubGQFJYlOfUu2RE";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log(chatId, text);

  await bot.sendMessage(chatId, "✌️");
});
bot.onText(/https:\/\/www.instagram.com\/.*/, async (msg) => {
  const chatId = msg.chat.id;
  const instagramUrl = msg.text;

  try {
    await instagram(instagramUrl).then(async (data) => {
      // console.log(data);
      const videoStream = await axios({
        url: data.data.video[0],
        method: "GET",
        responseType: "stream",
      });
      await bot.sendVideo(chatId, videoStream.data).catch((error) => {
        bot.sendMessage(chatId, "Videoni yuborishda xatolik yuz berdi.");
        console.error(error);
      });
    });
  } catch (error) {
    bot.sendMessage(chatId, "Xatolik yuz berdi yoki videoni yuklab bo'lmadi.");
  }
});
// tik tok downloader
bot.onText(/https:\/\/vt.tiktok.com\/.*/, async (msg) => {
  const chatId = msg.chat.id;
  const link = msg.text;

  try {
    let URL = await tikdown(link);
    // console.log(URL);
    const videoStream = await axios({
      url: URL.data.video,
      method: "GET",
      responseType: "stream",
    });
      await bot.sendVideo(chatId, URL.data.video).catch((error) => {
        bot.sendMessage(chatId, "Videoni yuborishda xatolik yuz berdi.");
        console.error(error);
    });
  } catch (error) {
    bot.sendMessage(chatId, "Xatolik yuz berdi yoki videoni yuklab bo'lmadi.");
  }
});