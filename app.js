const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { celebrate, Joi, errors } = require("celebrate");
const NotFoundError = require("./middlewares/errors/NotFoundError");


dotenv.config();
const  auth  = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");

const { PORT = 3001, BASE_PATH } = process.env;
const app = express();

const userRouter = require("./routes/users");
const cards = require('./routes/cards');


const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

const allowedCors = [
  "http://localhost:3000",

];


mongoose.connect('mongodb+srv://still:08292004@cluster0.s5trsea.mongodb.net/vandalvision', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});


app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers["access-control-request-headers"];

  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
  }

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});



app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});



app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);


app.use(auth);

app.use("/users", userRouter);
app.use("/cards", cards);


app.use("/*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: `${err.message}` });
});
