const Redis = require("redis");
const redisData = require("./redisData");
const { getAxiosRequest } = require("../_helper");
const redisClient = Redis.createClient();
//設定redis的expiration time為3600秒
const DEFAULT_EXPIRATION = 3600;

const heroData = {
  //取得未驗證heroes的資料
  getAllHeroes: async (req, res, callback) => {
    //先查看Redis內部是否有檔案，如果有資料則從redis取資料
    redisClient.get("heroes", async (error, heroes) => {
      if (error) console.error(error);
      if (heroes != null) {
        return callback(JSON.parse(heroes));
      } else {
        //如果沒有，則axios取得資料後，存入redis
        const heroes = await getAxiosRequest("/heroes");
        await setRedis("heroes", heroes.data);
        return callback(heroes.data);
      }
    });
  },

  //取得未驗證單一hero的資料
  getSingleHero: async (req, res, callback) => {
    const heroId = req.params["heroId"];
    redisClient.get(`heroes/${heroId}`, async (error, hero) => {
      if (error) console.error(error);
      if (hero != null) {
        return callback(JSON.parse(hero));
      } else {
        let hero = await getAxiosRequest(`/heroes/${heroId}`);
        //呼叫hero api，如果出現錯誤code = 1000，就繼續呼叫該api，取到值為止
        while (hero.data["code"]) {
          hero = await getAxiosRequest(`/heroes/${heroId}`);
        }
        await setRedis(`heroes/${heroId}`, hero.data);
        return callback(hero.data);
      }
    });
  },

  //取得成功驗證單一hero profile資料
  getSingleProfile: async (req, res, callback) => {
    const heroId = req.params["heroId"];
    redisClient.get(`heroes/${heroId}/profiles`, async (error, profile) => {
      if (error) console.error(error);
      if (profile != null) {
        return callback(JSON.parse(profile));
      } else {
        let hero = await getAxiosRequest(`/heroes/${heroId}`);
        //如果出現錯誤code = 1000，就繼續呼叫該api，取到值為止
        while (hero.data["code"]) {
          hero = await getAxiosRequest(`/heroes/${heroId}`);
        }

        //取得該id的profile資料
        const profile = await getAxiosRequest(`/heroes/${heroId}/profile`);
        //取得hero跟profile並將兩個資料做合併
        hero.data["profile"] = profile.data;
        await setRedis(`heroes/${heroId}/profiles`, hero.data);
        return callback(hero.data);
      }
    });
  },

  //取得成功驗證的所有heroes的profiles
  getHeroesProfiles: async (req, res, callback) => {
    redisClient.get("heroes/profiles", async (error, heroes) => {
      if (error) console.error(error);
      if (heroes != null) {
        return callback(JSON.parse(heroes));
      } else {
        //如果redis沒有資料就呼叫axios 取得資料
        const authHeroes = [];
        for (let i = 1; i <= 4; i++) {
          //取得該id的hero資料
          let hero = await getAxiosRequest(`/heroes/${i}`);
          while (hero.data["code"]) {
            hero = await getAxiosRequest(`/heroes/${i}`);
          }

          //取得該id的profile資料
          const profile = await getAxiosRequest(`/heroes/${i}/profile`);
          hero.data["profile"] = profile.data;
          //將data放入authHeroes array中
          authHeroes.push(hero.data);
        }
        await setRedis("heroes/profiles", authHeroes);
        return callback(authHeroes);
      }
    });
  },
};

//將data放進redis的function
function setRedis(key, data){
  return redisClient.setex(
    key,
    DEFAULT_EXPIRATION,
    JSON.stringify(data)
  );
}

module.exports = heroData;
