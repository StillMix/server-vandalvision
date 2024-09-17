const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getUser,
  getUsers,
  backUser,
  getInfoUser,
  patchInfoUser,
  deleteCard,
} = require("../controllers/users");

router.get("/me", getInfoUser);

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
    })
  }),
  getUser
);

router.patch(
  "/:id",
  celebrate({
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
      }),
    body: Joi.object().keys({
      password: Joi.string().required(),
    }),
  }),
  patchInfoUser
);

router.get("/", getUsers);

router.post("/backuser", backUser);

module.exports = router;
