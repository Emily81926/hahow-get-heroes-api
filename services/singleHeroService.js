const heroData = require("../models/heroData");
const axios = require("axios");
const heroesController = require("../controllers/heroesController");

const singleHeroesService = {
  //取得單一hero資料
  getSingleData: async (req, res, callback) => {
    await heroData.getSingleHero(req, res, (data) => {
      return callback(data);
    });
  },

  //去得單一hero的profile資料
  getSingleProfile: async (req, res, callback) => {
    //取得auth的result
    //先在post /auth (把name跟password放入req.body）
    try {
      const authResult = await axios({
        method: "post",
        baseURL: process.env.HAHOWBASEURL,
        url: "/auth",
        "Content-Type": "application/json",
        Accept: "application / json",
        data: { name: req.headers["name"], password: req.headers["password"] },
      });
      //如果成功，就取得profile資料
      await heroData.getSingleProfile(req, res, (data) => {
        return callback({ status: authResult.status, data });
      });
    } catch (error) {
      callback({
        status: error.response.status,
        message: error.response.statusText,
      });
    }

    //取得的result如果status是200則取得profile資料
    //取得的是400或是401則回傳錯誤的資訊
  },
};

module.exports = singleHeroesService;
