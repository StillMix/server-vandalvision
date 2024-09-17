const cardsData = require("../models/cards");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const BadRequest = require("../middlewares/errors/BadRequest");


module.exports.patchInfoCard = (req, res, next) => {
  const { name, articul, height, width,difficulty,colors,contours,linkconture,linkfull } = req.body;

  if ([name, articul, height, width,difficulty,colors,contours,linkconture,linkfull  ].some(field => field == null)) {
    return next(new BadRequest(`Поля не указано`));
  }

  cardsData.findByIdAndUpdate(
    req.params.id,
    { name, articul, height, width,difficulty,colors,contours,linkconture,linkfull },
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

module.exports.deleteCard = (req, res, next) => {
  cardsData.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Нет карточки с таким id"));
      }
      return cardsData.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      return cardsData.find({});
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

module.exports.getCard = (req, res, next) => {
  cardsData.findById(req.params.id)
    .then((cards) => {
      if (!cards) {
        return next(new NotFoundError('Нет карточки с таким id'));
      }
      return res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные при получении пользователя.'));
      }
      return next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  cardsData.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, articul, height, width,difficulty,colors,contours,linkconture,linkfull } = req.body;

  if ([name, articul, height, width,difficulty,colors,contours,linkconture,linkfull].some(field => field == null)) {
    return next(new BadRequest(`Поля не указано`));
  }

  cardsData.create({ name, articul, height, width,difficulty,colors,contours,linkconture,linkfull})
    .then((card) => {
      if (card) {
        return res.status(201).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequest("Переданы некорректные данные при создании карточки."));
      }
      return next(err);
    });
};
