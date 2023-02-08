const heroesService = require("../services/heroesService");

const heroesController = {
  //取得所有heroes資料(未經過authenticate的)
  getAllData: async (req, res) => {
    try {
      //如果header有Name或是有Password，則進入驗證api
      if (req.headers["name"] || req.headers["password"]) {
        await heroesService.getHeroesProfiles(req, res, (data) => {
          return res.status(data.status).json(data.data || data.message);
        });
      } else if (req.headers["show"]) {
        //如果headers有錯誤的參數，則回覆400
        return res.status(400).json("invalid request framing");
      } else {
        //如果headers找不到name，則直接給予所有heroes的basic資料
        await heroesService.getAllData(req, res, (data) => {
          return res.status(200).json(data);
        });
      }
    } catch (err) {
      return res.status(404).json({ message: "cannot find the data" });
    }
  },
};

module.exports = heroesController;
