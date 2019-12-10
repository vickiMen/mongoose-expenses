// Server setup
const express = require('express')
const app = express()
const api = require('./server/routes/api')
const bodyParser = require('body-parser')
const data = require('./data.json')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use( '/', api )


// Mongoose setup
const mongoose = require('mongoose')
const Expense = require('./server/model/Expense')
mongoose.connect('mongodb://localhost/Expenses', { useNewUrlParser: true })

// let newData = data.map( d => new Expense({
//     name: d.item,
//     amount: d.amount,
//     date: d.date,
//     group: d.group    
// }))

// newData.forEach( d => d.save())

const port = 3000
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})