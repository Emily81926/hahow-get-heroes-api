const singleHeroesService = require("../services/singleHeroService");

const singleHeroController = {
  //取得所有heroes資料(未經過authenticate的)
  getSingleData: async (req, res) => {
    try {
      //如果header有Name，則進入驗證api
      if (req.headers["name"] || req.headers["password"]) {
        await singleHeroesService.getSingleProfile(req, res, (data) => {
          return res.status(data.status).json(data.data || data.message);
        });
      } else if (req.headers["show"]) {
        //如果headers有錯誤的參數，則回覆400
        return res.status(400).json("invalid request framing");
      } else {
        //如果headers找不到name，則直接給予單一hero的basic資料
        await singleHeroesService.getSingleData(req, res, (data) => {
          return res.status(200).json(data);
        });
      }
    } catch (error) {
      return res.status(404).json({ message: "cannot find the data" });
    }
  },
};

module.exports = singleHeroController;
