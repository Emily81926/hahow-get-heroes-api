const Redis = require("redis");
const axios = require("axios");
const { promisifyAll } = require("bluebird");
//用promisifyAll打包redis的async await程式碼
promisifyAll(Redis);

const redisData = async () => {
  // Connect to redis at 127.0.0.1 port 6379 no password.
  const redisClient = Redis.createClient();
  //將Heroes所有資料放進redis
  const heroes = await axios({
    method: "get",
    baseURL: process.env.HAHOWBASEURL,
    url: "/heroes",
    "Content-Type": "application/json",
    Accept: "application / json",
  });
  //將取得的ㄘeroes資料放進redis
  await redisClient.setAsync("heroes", JSON.stringify(heroes.data));
};

//server一啟動，自動串連hero api，將hero資料放進redis方便快速拿取
redisData();

module.exports = redisData;

