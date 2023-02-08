const heroData = require("../models/heroData");
const heroesService = {
  //取得所有heroes資料
  getAllData: async (req, res, callback) => {
    await heroData.getAllHeroes(req, res, (data) => {
      return callback({ heroes: data });
    });
  },

  //取得所有heroes的profiles
  getHeroesProfiles: async (req, res, callback) => {
    //如果name跟password正確，取得profile data
    if (
      req.headers["name"] === process.env.HAHOWNAME &&
      req.headers["password"] === process.env.HAHOWPASSWORD
    ) {
      await heroData.getHeroesProfiles(req, res, (data) => {
        return callback({ status: 200, data: { heroes: data} });
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

module.exports = heroesService;
