const chai = require("chai");
const request = require("supertest");
const app = require("../app");
const expect = chai.expect;
const should = chai.should();

//取得「不需要」授權hero資料測試
describe("get single hero basic request", () => {
  //測試是否可以取得“不需授權”的單一hero資料
  it("should get 200 and id 1 hero data", (done) => {
    request(app)
      .get("/heroes/1")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        //如果有error，回傳error
        if (err) return done(err);
        //如果沒有error，res.body內需為物件
        expect(res.body).to.be.an("object");
        //取得的hero資料id為1
        res.body["id"].should.equal("1");
        done();
      });
  });

  it("should get 200 and id 5 hero data", (done) => {
    request(app)
      .get("/heroes/5")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        //如果有error，回傳error
        if (err) return done(err);
        //如果沒有error，res.body內需為物件
        expect(res.body).to.be.an("object");
        //取得的hero資料id為5
        res.body["id"].should.equal("5");
        done();
      });
  });
});
