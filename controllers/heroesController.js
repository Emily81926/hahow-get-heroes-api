const heroesService = require("../services/heroesService");

const heroesController = {
  //取得所有heroes資料(未經過authenticate的)
  getAllData: async (req, res) => {
    try {
      await heroesService.getAllData(req, res, (data) => {
        return res.status(200).json(data);
      });
    } catch (err) {
      return res.status(404).json({message: "cannot find the data"});
    }
  },
};

module.exports = heroesController;
