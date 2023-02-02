const mongoose = require('mongoose');

require('dotenv').config();

mongoose.set('strictQuery', false);

const url = `mongodb+srv://fullstack-xiahui:${process.env.MONGODB_URI}@cluster0.qju8mmr.mongodb.net/phonebook?retryWrites=true&w=majority`;
console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return  /\d{2}-\d+/.test(v) || /\d{3}-\d+/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);