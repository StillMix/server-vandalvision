const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../middlewares/errors/Unauthorized');

const userSchema = new mongoose.Schema({
  login:
  {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

userSchema.statics.findUserByCredentials = function (login, password, res, next) {
  return this.findOne({ login }).select('+password')
    .then((user) => {
      if (!user) {
        console.log(user);
        throw new Unauthorized('Неправильные почта или пароль');
      } else {
        console.log(user);
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new Unauthorized('Неправильные почта или пароль');
            } else {
              console.log(user);
              return user;
            }
          });
      }
    });
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);