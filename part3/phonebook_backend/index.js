const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')

// Define a custom token for request body
morgan.token('reqbody', (req) => {
  if (req.method === 'POST') {
    const { id, ...bodyWithoutId } = req.body
    return JSON.stringify(bodyWithoutId)
  }
  return ''
})

// Configure morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))

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
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Creates new person
app.post('/api/persons', (request, response) => {
  const generateId = () => {
    return Math.floor(Math.random() * 100000)
  }

  const person = request.body

  // Check both name and number are included
  if(!person.name || !person.number) {
    return response.status(400).json({ error: 'Name and number are required' }) 
  }

  // Check if person is already in phonebook
  if(persons.find(p => p.name === person.name)) {
    return response.status(409).json({ error: 'Name already exists in the phonebook' })
  }

  person.id = generateId()

  persons = persons.concat(person)
  response.json(person)
})

// Deletes a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

// Shows info for the backend
app.get('/info', (request, response) => {
  const options = {
    weekday: 'short',  
    month: 'short',    
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long'
  }
  
  const formattedDate = new Date().toLocaleString('en-FI', options).replace(/,/g, '')
  response.send(`Phonebook has info for ${persons.length} people<br><br>${formattedDate}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})