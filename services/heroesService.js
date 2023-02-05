const heroData = require("../models/heroData");
const heroesService = {
  //取得所有heroes資料
  getAllData: async(req, res, callback) => {
    await heroData.getAllHeroes(req, res, (data) => {
      return callback({ heroes: data })
    })    
  }
}

module.exports = heroesService;
