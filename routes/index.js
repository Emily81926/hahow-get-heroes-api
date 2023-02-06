const express = require("express");
const router = express.Router();
const heroesController = require("../controllers/heroesController");
const singleHeroController = require("../controllers/singleHeroController")

router.get("/heroes", heroesController.getAllData);
router.get("/heroes/:heroId", singleHeroController.getSingleData);

module.exports = router;
