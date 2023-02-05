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
        });
    });
  });
});

//取得需要授權hero資料
describe("get single hero authenticated request", () => {
  //測試帳號密碼正確的狀況
  context("name and password correct", () => {
    it("should get 200 and profile", (done) => {
      request(app)
        .get("/heroes/1")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Name", "hahow")
        .set("Password", "rocks")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("object");
          //有取得該hero資料，且包含profile的object資料
          expect(res.body["profile"]).to.be.an("object");
          done();
        });
    });
  });

  //測試帳號或密碼不正確的狀況
  context("name or password wrong", () => {
    it("should get 401", (done) => {
      request(app)
        .get("/heroes/1")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Name", "hahow")
        .set("Password", "rockssss")
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          //雖然驗證失敗，但是仍可以取得hero不需授權的資料
          expect(res.body).to.be.an("object");
          //取得的hero資料id為1
          res.body["id"].should.equal("1");
          //不應該有profile資料出現
          expect(res.body).to.not.have.any.keys("profile");
          done();
        });
    });
  });

  //測試輸入參數錯誤的狀況
  context("invalid request framing", () => {
    it("should get 400", (done) => {
      request(app)
        .get("/heroes/1")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Show", "me the secret")
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          //雖然驗證失敗，但是仍可以取得heroes不需授權的資料
          expect(res.body).to.be.an("object");
          //取得的hero資料id為1
          res.body["id"].should.equal("1");
          //不應該有profile資料出現
          expect(res.body).to.not.have.any.keys("profile");
          done();
        });
    });
  });
});
