const express = require("express");
const cors = require("cors");
const logger = require("heroku-logger");
const forceSsl = require("force-ssl-heroku");

const status = require("./server/config/status");
const tweets = require("./server/routes/tweets");

const app = express();
app.use(forceSsl);

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["authorization",]
};
app.use(cors(corsOptions));

const db = require("./server/models/index");
db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Conexão com BD estabelecida com sucesso.");
  })
  .catch(err => {
    logger.error("Não foi possível conectar com o BD: ", err);
  });

app.use("/api/tweets", tweets);

app.get("/", (req, res) => {
  res.status(status.SUCCESS).json({
    status: "OK",
    msg: "API de acesso à dados do twitter de parlamentares do Congresso Nacional"
  });
});

const port = process.env.PORT || 5001;
app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
