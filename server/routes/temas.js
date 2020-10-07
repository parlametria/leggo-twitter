const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const Tema = models.tema;

router.get("/", (req, res) => {
  Tema.findAll()
    .then((temas) => {
      res.status(status.SUCCESS).json(temas);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

module.exports = router;
