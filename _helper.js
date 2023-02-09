const axios = require("axios");

async function getAxiosRequest(url) {
  return await axios({
    method: "get",
    baseURL: process.env.HAHOWBASEURL,
    url: url,
    "Content-Type": "application/json",
    Accept: "application/json",
  });
}

module.exports = {
  getAxiosRequest,
};
