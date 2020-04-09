const path = require('path');
const express = require('express');
const service = require('./service');
const expensesRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

const serializeExpense = expense => {

    return {
    id: expense.id,
    amount: expense.amount,
    description: xss(expense.description),
    date: new Date(expense.date).toISOString().split("T")[0],
    style: expense.style,
    usernumber: expense.usernumber,
    }
};
expensesRouter
    .route('/user/0')
    .get((req, res) => {
        res.send({
            amount: 0,
            description: "You need to log back in",
            date:" 2020-04-06",
            style: "--",
            })
       })
expensesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        service.getAllExpenses(knexInstance)
            .then(expenses => {
                res.json(expenses.map(serializeExpense))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { amount, style, description, date, usernumber } = req.body;
        const newExpense = { amount, style, description, date, usernumber }

        for (const [key, value] of Object.entries(newExpense))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
        
        service.insertExpense(
            req.app.get('db'),
            newExpense
        )
            .then(expense => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${expense.id}`))
                    .json(serializeExpense(expense))
            })
        .catch(next)
    })
expensesRouter
    .route('/:expense_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        service.getById(
            knexInstance,
            req.params.expense_id
        )
        .then(expense => {
            if (!expense) {
                return res.status(404).json({
                    error: { message: `Expense doesn't exist` }
                })
            } 
            console.log
            res.expense = expense
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeExpense(res.expense))
    })
    .delete((req, res, next) => {
        service.deleteExpense(
            req.app.get('db'),
            req.params.expense_id
        )
            .then(() => {
                res.status(204).end()
                console.log('worked');
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { amount, style, description } = req.body;
        const expenseToUpdate = { amount, style, description }

        const numberOfValues = Object.values(expenseToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'amount', 'style', or 'description'`
                }
            })
        }

        service.updateExpense(
            req.app.get('db'),
            req.params.expense_id,
            expenseToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
expensesRouter
    .route('/user/:expense_usernumber')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        service.getByusernumber(
            knexInstance,
            req.params.expense_usernumber
        )
        .then(expense => {
            if (!expense) {
                return res.status(404).json({
                    error: { message: `Expense doesn't exist` }
                })
            } 
            console.log
            res.expense = expense
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.expense.map(serializeExpense))
    })
    .delete((req, res, next) => {
        service.deleteExpense(
            req.app.get('db'),
            req.params.expense_usernumber
        )
            .then(() => {
                res.status(204).end()
                console.log('worked');
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { amount, style, description } = req.body;
        const expenseToUpdate = { amount, style, description }

        const numberOfValues = Object.values(expenseToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'amount', 'style', or 'description'`
                }
            })
        }

        service.updateExpense(
            req.app.get('db'),
            req.params.expense_usernumber,
            expenseToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    module.exports = expensesRouter;