const express = require('express')
const router = express.Router()
const Expense = require('../model/Expense')
const moment = require('moment')

router.get('/expenses', function(req,res){
    Expense.find().sort({date:-1}).exec(function(err,expenses){
        res.send(expenses)
    })
})

router.post('/new', function(req,res){
    let newDate = req.body.date ? (moment(req.body.date).format('LLLL')) : moment().format('LLLL')
    let newExpense = new Expense({
        name: req.body.name,
        amount: req.body.amount,
        group: req.body.group,
        date: newDate
    })
    newExpense.save().then(function(expense){console.log(`${expense.name} was added successfully!`)})
    res.end()
})

router.put('/update', function(req,res){
    const group1 = req.body.group1
    const group2 = req.body.group2
    const filter = { group: `${group1}` }
    const update = { group: `${group2}` } 
    Expense.findOneAndUpdate(filter, update, function(err,expense){
        res.send(`changed ${expense._id} from group: ${expense.group} to group: ${group2}`)
    })
})


router.get('/expenses/:group', function(req,res){
    const group = req.params.group
    const total = req.query.total
    const d1 = req.query.d1
    const d2 = req.query.d2
    if (d1) {
        Expense.find({
            group: `${group}`,
            date: {$gte: d1, $lt: d2 || moment().format()}
        })
        .then(function(expenses){
            res.send(expenses)
        })
    }
    else {
        if (!total || total == 'false'){
            Expense.find({group: `${group}`})
            .then(function(expenses){
                res.send(expenses)
            })
        }
        else {
            Expense.aggregate([
                {
                    $match: {
                        group: `${group}`
                    }
                },
                {
                    $group: {
                        _id: '$group', 
                        totalGroupAmount: {$sum: '$amount'}
                    }   
                }
            ]).then(function(expenses){res.send(expenses)})
    }
}})

module.exports = router