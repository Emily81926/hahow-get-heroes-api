const axios = require("axios");

const heroData = {
  //取得所有heroes的資料
  getAllHeroes: async (req, res, callback) => {
    const heroes = await axios({
      method: "get",
      //保護該baseURL不被他人使用
      baseURL: process.env.HAHOWBASEURL,
      url: "/heroes",
      "Content-Type": "application/json",
      "Accept": "application / json",
    });
    return callback(heroes.data);
  },
};

module.exports = heroData;
