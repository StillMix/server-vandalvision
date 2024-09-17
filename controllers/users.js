const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const BadRequest = require("../middlewares/errors/BadRequest");
const Conflict = require("../middlewares/errors/Conflict");

const { NODE_ENV, JWT_SECRET } = process.env;


module.exports.deleteCard = (req, res, next) => {
  User.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Нет карточки с таким id"));
      }
      return User.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      return User.find({});
    })
    .then((cards) => {
      return res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequest("Переданы некорректные данные при удалении карточки."));
      }
      return next(err);
    });
};

module.exports.patchInfoUser = (req, res, next) => {
  const { password } = req.body;

  if ([password ].some(field => field == null)) {
    return next(new BadRequest(`Поля не указано`));
  }

  User.findByIdAndUpdate(
    req.params.id,
    { password },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Нет карточки с таким id"));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequest("Переданы некорректные данные при получении карточки."));
      }
      return next(err);
    });
};



module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("Нет пользователя с таким id"));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequest(
            "Переданы некорректные данные при получении пользователя."
          )
        );
      }
      return next(err);
    });
};

module.exports.getInfoUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("Нет пользователя с таким id"));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequest(
            "Переданы некорректные данные при получении пользователя."
          )
        );
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.backUser = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  res.clearCookie("jwt").status(200).send({ message: "Удачного дня!" });
};

module.exports.createUser = (req, res, next) => {
  const { login, password } = req.body;

  if ( !password || !login) {
    return next(new BadRequest("Пароль или логин не указаны"));
  }

  User.findOne({ login })
    .then((user) => {
      if (user) {
        return next(new Conflict("Пользователь уже создан"));
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            login,
            password: hash,
          })
        )
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === "ValidationError") {
            return next(
              new BadRequest(
                "Переданы некорректные данные при создании пользователя."
              )
            );
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return next(new BadRequest("Логин или пароль не указаны"));
  }

  User.findUserByCredentials(login, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key');

        return res
          .status(200)
          .send({ user: user.toJSON(), token });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequest(
            "Переданы некорректные данные при получении пользователя."
          )
        );
      }
      return next(err);
    });
};
