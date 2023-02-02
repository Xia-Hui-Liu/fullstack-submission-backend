const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.get('/info', (req, res) => {
  Person.countDocuments().then((count) => {
    const date = new Date(Date.now());
    res.send(`<p> Phonebook has info for ${count} people </p> <p> ${date.toUTCString()}</p>`);
  });
});
  
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error)
    );
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id, 
    {name, number}, 
    { new: true, runValidators: true, context: 'query'})
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});
  
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end();
  }).catch((error) => next(error));
});


app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  const person = new Person({
    name,
    number,
  });
 
  person.save().then((savePerson) => {
    res.json(savePerson);
  }).catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
    
app.use(errorHandler);


const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Service listen on port ${port}`);
});

