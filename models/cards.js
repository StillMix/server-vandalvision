const mongoose = require('mongoose');


const cardsSchema = new mongoose.Schema({
  name:
  {
    type: String,
    required: true,

  },
  articul: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    required: true,
  },
  difficulty:{
    type: String,
    required: true,
  },
  colors:{
    type: String,
    required: true,
  },
  contours:{
    type: String,
    required: true,
  },
  linkconture: {
    type: String,
    required: true,
  },
  linkfull: {
    type: String,
    required: true,
  },
});




module.exports = mongoose.model('cards', cardsSchema);