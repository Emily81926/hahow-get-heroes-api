const chai = require("chai");
const request = require("supertest");
const app = require("../app");
const expect = chai.expect;
const should = chai.should();

//取得不需要授權heroes資料
describe("get all heroes basic request", () => {
  //測試是否可以取得“不需授權”的所有heroes資料
  it("should get 200 and heroes list", (done) => {
    request(app)
      .get("/heroes")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
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


//取得需要授權heroes資料
describe("get all heroes authenticated request", () => {
  //測試帳號密碼正確的狀況
  context("name and password correct", () => {
    it("should get 200 and profile", (done) => {
      request(app)
        .get("/heroes")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Name", process.env.HAHOWNAME)
        .set("Password", process.env.HAHOWPASSWORD)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("object");
          //有取得多筆heroes資料，且都包含profile的object資料
          expect(res.body["heroes"][0]["profile"]).to.be.an("object");
          expect(res.body["heroes"][1]["profile"]).to.be.an("object");
          done();
        });
    });
  });
  
  //測試帳號或密碼不正確的狀況
  context("name or password wrong", () => {
    it("should get 401", (done) => {
      request(app)
        .get("/heroes")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Name", process.env.HAHOWNAME)
        .set("Password", "rockssss")
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          //驗證失敗會從res.body取得錯誤string資訊
          expect(res.body).to.be.an("string");
          done();
        });
    });
  });

  //測試輸入參數錯誤的狀況
  context("invalid request framing", () => {
    it("should get 400", (done) => {
      request(app)
        .get("/heroes")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Show", "me the secret")
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          //驗證失敗會從res.body取得錯誤string資訊
          expect(res.body).to.be.an("string");
          done();
        });
    });
  });
});

