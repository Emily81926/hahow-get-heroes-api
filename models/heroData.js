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
      Accept: "application / json",
    });
    return callback(heroes.data);
  },

  //取得單一hero的資料
  getSingleHero: async (req, res, callback) => {
    const hero = await axios({
      method: "get",
      baseURL: process.env.HAHOWBASEURL,
      //從req.params取得heroId
      url: `/heroes/${req.params["heroId"]}`,
      "Content-Type": "application/json",
      Accept: "application / json",
    });

    return callback(hero.data);
  },

  //取得單一hero profile資料
  getSingleProfile: async (req, res, callback) => {
    //取得hero資料
    const hero = await axios({
      method: "get",
      baseURL: process.env.HAHOWBASEURL,
      //從req.params取得heroId
      url: `/heroes/${req.params["heroId"]}`,
      "Content-Type": "application/json",
      Accept: "application / json",
    });

    //取得該id的profile資料
    const profile = await axios({
      method: "get",
      baseURL: process.env.HAHOWBASEURL,
      url: `/heroes/${req.params["heroId"]}/profile`,
      "Content-Type": "application/json",
      Accept: "application / json",
    });
    //將兩個資料做合併並回傳
    hero.data["profile"] = profile.data;
    return callback(hero.data);
  },
};

module.exports = heroData;
