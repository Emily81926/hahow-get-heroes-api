const Redis = require("redis");
const axios = require("axios");
const { promisifyAll } = require("bluebird");
//用promisifyAll打包redis的async await程式碼
promisifyAll(Redis);

const redisData = async () => {
  // Connect to redis at 127.0.0.1 port 6379 no password.
  const redisClient = Redis.createClient();
  //1.將Heroes所有資料放進redis
  const heroes = await axios({
    method: "get",
    baseURL: process.env.HAHOWBASEURL,
    url: "/heroes",
    "Content-Type": "application/json",
    Accept: "application / json",
  });
  //將取得的heroes資料放進redis
  await redisClient.setAsync("heroes", JSON.stringify(heroes.data));

  //2.取得單一hero的資料
  for (let i = 1; i <= 4; i++) {
    let hero = await axios({
      method: "get",
      baseURL: process.env.HAHOWBASEURL,
      url: `/heroes/${i}`,
      "Content-Type": "application/json",
      Accept: "application / json",
    });
    //如果出現錯誤code = 1000，就繼續呼叫該api，取到值為止
    while (hero.data["code"]) {
      hero = await axios({
        method: "get",
        baseURL: process.env.HAHOWBASEURL,
        url: `/heroes/${i}`,
        "Content-Type": "application/json",
        Accept: "application / json",
      });
    }
    //每一筆hero資料都是一筆redis資料
    await redisClient.setAsync(`heroes/${i}`, JSON.stringify(hero.data));
  }
};

//server一啟動，自動串連hero api，將hero資料放進redis方便快速拿取
redisData();

module.exports = redisData;

