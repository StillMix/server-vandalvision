const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  deleteCard,
  getCards,
  patchInfoCard,
  createCard,
  getCard,
} = require("../controllers/cards");

router.delete(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard
);

router.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getCard
);


router.get("/", getCards);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        articul: Joi.string().required(), 
        height: Joi.string().required(),
        width: Joi.string().required(),
        difficulty: Joi.string().required(),
        colors: Joi.string().required(),
        contours: Joi.string().required(),
        linkconture: Joi.string().required(),
        linkfull: Joi.string().required(),
      }),
  }),
  createCard
);

router.patch(
  "/:id",
  celebrate({
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
      }),
    body: Joi.object().keys({
      name: Joi.string().required(),
      articul: Joi.string().required(), 
      height: Joi.string().required(),
      width: Joi.string().required(),
      difficulty: Joi.string().required(),
      colors: Joi.string().required(),
      contours: Joi.string().required(),
      linkconture: Joi.string().required(),
      linkfull: Joi.string().required(),
    }),
  }),
  patchInfoCard
);

module.exports = router;
