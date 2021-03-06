require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const expensesRouter = require('./expensesRouter/expensesRouter');
const usersRouter = require('./usersRouter/usersRouter');
const authRouter = require('./authRouter/authRouter');
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/expenses', expensesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);



app.get('/', (req, res) => {
 res.send('Hello, world!')
})
app.get('/api/users/test123', (req, res) => {
  res.send('Please Log in')
 })

app.use(function errorHandler(error, req, res, next) {
 let response
 if (NODE_ENV === 'production') {
 response = { error: { message: error.message } }
 } else {
 console.error(error)
 response = { message: error.message, error }
 }
 res.status(500).json(response)
})

module.exports = app

