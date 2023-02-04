const chai = require("chai");
const request = require("supertest");
const app = require("../app");
const expect = chai.expect;
const should = chai.should();

//取得不需要授權heroes資料測試
describe("get all heroes basic request", () => {
  //測試是否可以取得“不需授權”的所有heroes資料
  it("should get 200 and heroes list", (done) => {
    request(app)
      .get("/heroes")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        //如果有error，回傳error
        if (err) return done(err);
        //如果沒有error，res.body內不需為物件
        expect(res.body).to.be.an("object");
        //有取得多筆heroes資料，以取得前兩筆資料id 1跟id 2的方式來驗證
        res.body["heroes"][0]["id"].should.equal("1");
        res.body["heroes"][1]["id"].should.equal("2");
        done();
      });
  });
});

