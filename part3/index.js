const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const date = new Date(Date.now())
    res.send(`<p> Phonebook has info for ${persons.length} people </p> <p> ${date.toUTCString()}</p>`)
  })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if(person){
    res.json(person)
    } else {
        res.status(404).send()
    }
})

const generateId = () => {
    const min = Math.max(...persons.map(e => e.id));
    const max = 99;
    const maxId = persons.length > 0
        ? Math.floor(Math.random() * (max - min) + min)
        :0 
    return maxId + 1
}
app.post('/api/persons', (req, res) => {
    const body = req.body;
    const findName= persons.find(e => e.name === body.name);
    const findNumber = persons.find(e => e.number === body.number);
    if (!body.name || !body.number){
        res.status(400).send('name and number are required')
        return;
    }
    if(findName || findNumber){
        res.status(400).send({ error: 'name and number must be unique' });
        return;
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person);
    res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end()  
})

const port = process.env.PORT || 4001;
app.listen(port, () => {
   console.log(`Service listen on port ${port}`)});