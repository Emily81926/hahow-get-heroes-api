const axios = require("axios");
const Redis = require("redis");
const redisData = require("./redisData");

const redisClient = Redis.createClient();
//設定redis的expiration time為3600秒
const DEFAULT_EXPIRATION = 3600;

const heroData = {
  //取得所有heroes的資料
  getAllHeroes: async (req, res, callback) => {
    //先查看Redis內部是否有檔案
    redisClient.get("heroes", async (error, heroes) => {
      if (error) console.error(error);
      //如果redis有資料，就從redis取資料
      if (heroes != null) {
        return callback(JSON.parse(heroes));
      } else {
        //如果沒有，則axios取得資料後，存入redis
        const heroes = await axios({
          method: "get",
          //保護該baseURL不被他人使用
          baseURL: process.env.HAHOWBASEURL,
          url: "/heroes",
          "Content-Type": "application/json",
          Accept: "application / json",
        });

        //將取得的資料放進Redis，縮短取用資料的時間
        redisClient.setex(
          "heroes",
          DEFAULT_EXPIRATION,
          JSON.stringify(heroes.data)
        );
        return callback(heroes.data);
      }
    });
  },

  //取得單一hero的資料
  getSingleHero: async (req, res, callback) => {
    redisClient.get(`heroes/${req.params["heroId"]}`, async (error, hero) => {
      if (error) console.error(error);
      //如果redis有資料，就從redis取資料
      if (hero != null) {
        return callback(JSON.parse(hero));
      } else {
        //呼叫hero api
        const hero = await axios({
          method: "get",
          baseURL: process.env.HAHOWBASEURL,
          //從req.params取得heroId
          url: `/heroes/${req.params["heroId"]}`,
          "Content-Type": "application/json",
          Accept: "application / json",
        });
        //將取得的資料放進Redis，縮短取用資料的時間
        redisClient.setex(
          `heroes/${req.params["heroId"]}`,
          DEFAULT_EXPIRATION,
          JSON.stringify(hero.data)
        );
        return callback(hero.data);
      }
    });
  },

  //取得單一hero profile資料
  getSingleProfile: async (req, res, callback) => {
    redisClient.get(
      `heroes/${req.params["heroId"]}/profiles`,
      async (error, profile) => {
        if (error) console.error(error);
        //如果redis有資料，就從redis取資料
        if (profile != null) {
          return callback(JSON.parse(profile));
        } else {
          //如果redis沒有資料就呼叫api，並將資料放進redis
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
          //將兩個資料做合併
          hero.data["profile"] = profile.data;
          //資料放入redis
          redisClient.setex(
            `heroes/${req.params["heroId"]}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(hero.data)
          );
          return callback(hero.data);
        }
      }
    );
  },
};

module.exports = heroData;
