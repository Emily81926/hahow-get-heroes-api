const Redis = require("redis");
const { getAxiosRequest } = require("../_helper");
const { promisifyAll } = require("bluebird");
//用promisifyAll打包redis的async await程式碼
promisifyAll(Redis);

const redisData = async () => {
  // Connect to redis at 127.0.0.1 port 6379 no password.
  const redisClient = Redis.createClient();
  //1.將Heroes所有資料放進redis
  const heroes = await getAxiosRequest("/heroes");
  //將取得的heroes資料放進redis
  await redisClient.setAsync("heroes", JSON.stringify(heroes.data));
  console.log("heroes資料已放進redis");

  //2.將每筆hero資料分別放入redis
  for (let i = 1; i <= 4; i++) {
    let hero = await getAxiosRequest(`/heroes/${i}`);
    //如果出現錯誤code = 1000，就繼續呼叫該api，取到值為止
    while (hero.data["code"]) {
      hero = await getAxiosRequest(`/heroes/${i}`);
    }
    //每一筆hero資料都是一筆redis資料
    await redisClient.setAsync(`heroes/${i}`, JSON.stringify(hero.data));
  }

  console.log("single hero資料已放進redis");
  
  //3.將每筆hero含profile資料放進redis
  for (let i = 1; i <= 4; i++) {
    const profile = await getAxiosRequest(`/heroes/${i}/profile`);
    const hero = await redisClient.getAsync(`heroes/${i}`);
    const heroParse = JSON.parse(hero);
    //將profile資料放進single hero資料
    heroParse["profile"] = profile.data;

    await redisClient.setAsync(
      `heroes/${i}/profiles`,
      JSON.stringify(heroParse)
    );
  }
  console.log("single hero profile 資料已放進redis");

  //4.將所有heroes的profile資料放進redis
  const authHeroes = [];
  for (let i = 1; i <= 4; i++) {
    //拿取單一hero profile資料
    const profile = await redisClient.getAsync(`heroes/${i}/profiles`);
    //將data放入authHeroes array中
    authHeroes.push(JSON.parse(profile));
  }
  await redisClient.setAsync("heroes/profiles", JSON.stringify(authHeroes));

  console.log("all hero profile 資料已放進redis");
};

//server一啟動，自動串連hero api，將hero資料放進redis方便快速拿取
redisData();

module.exports = redisData;
