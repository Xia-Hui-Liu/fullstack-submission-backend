const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const express = require('express');
const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

let persons = [
  { 
    'id': 1,
    'name': 'Arto Hellas', 
    'number': '040-123456'
  },
  { 
    'id': 2,
    'name': 'Ada Lovelace', 
    'number': '39-44-5323523'
  },
  { 
    'id': 3,
    'name': 'Dan Abramov', 
    'number': '12-43-234345'
  },
  { 
    'id': 4,
    'name': 'Mary Poppendieck', 
    'number': '39-23-6423122'
  }
];

app.get('/api/persons', (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get('/info', (req, res) => {
  Person.countDocuments().then((count) => {
    const date = new Date(Date.now());
    res.send(`<p> Phonebook has info for ${count} people </p> <p> ${date.toUTCString()}</p>`);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({ error: 'person not found' });
      }
      res.json(person);
    })
    .catch((error) => next(error)
    );
});

app.post('/api/persons', (req, res) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  persons = persons.concat(person);
  person.save().then((savePerson) => {
    res.json(savePerson);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Something went wrong' });
  });
});

app.put('/api/persons/:id', (req, res) => {
  Person.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, person) => {
    if (err) return res.status(500).send(err);
    return res.send(person);
  });
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


app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end();
  });
});


const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Service listen on port ${port}`);
});

