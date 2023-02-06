const singleHeroesService = require("../services/singleHeroService");

const singleHeroController = {
  //取得所有heroes資料(未經過authenticate的)
  getSingleData: async (req, res) => {
    await singleHeroesService.getSingleData(req, res, (data) => {
      return res.status(200).json(data);
    });
  },
};

module.exports = singleHeroController;
