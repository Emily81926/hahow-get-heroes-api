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
    if (
      req.headers["name"] === process.env.HAHOWNAME &&
      req.headers["password"] === process.env.HAHOWPASSWORD
    ) {
      await heroData.getSingleProfile(req, res, (data) => {
        return callback({ status: 200, data });
      });
    } else {
      //如果name或password錯誤，回傳401
      return callback({
        status: 401,
        message: "name or password is incorrect",
      });
    }
  },
};

module.exports = singleHeroesService;
