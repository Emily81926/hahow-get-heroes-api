const express = require('express')
const router = express.Router()
const heroesController = require('../controllers/heroesController')

router.get('/heroes', heroesController.getAllData)

module.exports = router