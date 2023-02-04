const chai = require("chai");
const request = require("supertest");
const app = require("../app");
const expect = chai.expect;
const should = chai.should();

//取得「不需要」授權hero資料測試
describe("get single hero basic request", () => {
  //可以成功取得單一hero資料
  context("get hero data", () => {
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
  });

  //所輸入的id找不到資料
  context("hero data not found", () => {
    it("should get 404 and error message", (done) => {
      request(app)
        .get("/heroes/10")
        .set("Accept", "application/json")
        .expect(404)
        .end((err, res) => {
          //如果有error，回傳error
          if (err) return done(err);
          //如果沒有error，res.body內需為物件
          expect(res.body).to.be.an("object");
          //取得的錯誤資訊
          res.body["message"].should.equal("cannot find the data");
          done();
        })
    })
  })
});
