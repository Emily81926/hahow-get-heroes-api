const heroData = require("../models/heroData");
const singleHeroesService = {
  //取得單一hero資料
  getSingleData: async (req, res, callback) => {
    await heroData.getSingleHero(req, res, (data) => {
      return callback(data);
    });    
  },
};

module.exports = singleHeroesService;
