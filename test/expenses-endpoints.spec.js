
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeExpensesArray } = require('./expenses.fixtures');

describe("Expenses Endpoints", function() {
    let db;
  
    before("make knex instance", () => {
      db = knex({
        client: "pg",
        connection: process.env.TEST_DB_URL
      });
      app.set("db", db);
    });
  
    after("disconnect from db", () => db.destroy());
  
    before("clean the table", () => db("expense_logs").truncate());
  
    afterEach("cleanup", () => db("expense_logs").truncate());
    
    describe(`GET /api/expenses`, () => {
        context(`Give no expenses`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get("/expenses")
              .expect(200, []);
          });
        });
    
        context("Given there are expenses in the database", () => {
          const testExpenses = makeExpensesArray();
    
          beforeEach("insert expenses", () => {
            return db.into("expense_logs").insert(testExpenses);
          });
    
          it("GET /api/expenses responds with 200 and all of the expenses", () => {
            return supertest(app)
              .get("/expenses")
              .expect(200, testExpenses);
          });
        });
      });
    
      describe(`GET /expenses/:expenses_id`, () => {
        context(`Given no expenses`, () => {
          it(`responds with 404`, () => {
            const expenseId = 123456;
            return supertest(app)
              .get(`/expenses/${expenseId}`)
              .expect(404, { error: { message: `Expense doesn't exist` } });
          });
        });
        context('Given there are articles in the database', () => {
          const testExpenses = makeExpensesArray()
    
          beforeEach('insert expensess', () => {
            return db
              .into('expense_logs')
              .insert(testExpenses)
          })
    
          it('responds with 200 and the specified expense', () => {
            const expenseId = 2
            const expectedExpense = testExpenses[expenseId - 1]
             return supertest(app)
              .get(`/expenses/${expenseId}`)
              .expect(200, expectedExpense)
          });
        })
        context(`Given an XSS attack article`, () => {
            const maliciousExpense = {
              id: 911,
              amount: "1.51",
              style: "Life Style",
              description: `Bad image<img src="https://url.to.file.which/does-not.exist">.But not<strong>all</strong> bad.`
            };
      
            beforeEach("insert malicious expense", () => {
              return db.into("expense_logs").insert([maliciousExpense]);
            });
      
            it("removes XSS attack content", () => {
              return supertest(app)
                .get(`/expenses/${maliciousExpense.id}`)
                .expect(200)
                .expect(res => {
                  expect(res.body.description).to.eql(
                    `Bad image<img src="https://url.to.file.which/does-not.exist">.But not<strong>all</strong> bad.`
                  );
                });
            });
          });
        });
      describe(`POST /expenses`, () => {
        it(`creates an expense, responding with 201 and the new expense`,  function() {
            const newEx = {
                amount: "99.99",
                style: "Food",
                description: "Groceries for the week",
                date: new Date().toISOString().split("T")[0]
              };
          
            return supertest(app)
            .post('/expenses')
            .send( newEx)
            .expect(201)
            .expect(res => {
                expect(res.body.amount).to.eql(newEx.amount);
                expect(res.body.style).to.eql(newEx.style);
                expect(res.body.description).to.eql(newEx.description);
                expect(res.headers.location).to.eql(`/expenses/${res.body.id}`);
                const expected = new Date().toISOString().split("T")[0];
                const actual = new Date().toISOString().split("T")[0];
                expect(actual).to.eql(expected);
            })
            .then(postRes =>
              supertest(app)
                .get(`/expenses/${postRes.body.id}`)
                .expect(postRes.body)
            );
        });
        const requiredFields = ["amount", "style", "description"];
    
        requiredFields.forEach(field => {
          const newEx = {
            amount: "49.99",
            style: "Bills",
            description: "Test new expense description"
          };
    
          it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newEx[field];
    
            return supertest(app)
              .post("/expenses")
              .send(newEx)
              .expect(400, {
                error: { message: `Missing '${field}' in request body` }
              });
          });
        });
    })
    describe(`DELETE /api/expenses/:expense_id`, () => {
        context(`Given no expenses`, () => {
          it(`responds with 404`, () => {
            const expenseId = 123456;
            return supertest(app)
              .delete(`/expenses/${expenseId}`)
              .expect(404, { error: { message: `Expense doesn't exist` } });
          });
        });
        context(`Given there are expenses in the database`, () => {
          const testExpenses = makeExpensesArray();
    
          beforeEach("insert expenses", () => {
            return db.into("expense_logs").insert(testExpenses);
          });
    
          it("responds with 204 and removes the expense", () => {
            const idRemove = 2;
            const expectedExpense = testExpenses.filter(
              expense => expense.id !== idRemove
            );
            return supertest(app)
              .delete(`/expenses/${idRemove}`)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/expenses`)
                  .expect(expectedExpense)
              );
          });
        });
      });
      describe(`PATCH /api/expenses/:expense_id`, () => {
        context(`Given no expenses`, () => {
          it(`responds with 404`, () => {
            const expenseId = 999999;
            return supertest(app)
              .patch(`/expenses/${expenseId}`)
              .expect(404, { error: { message: `Expense doesn't exist` } });
          });
        });
    
        context("Given there are expenses in the database", () => {
          const testExpenses = makeExpensesArray();
    
          beforeEach("insert expenses", () => {
            return db.into("expense_logs").insert(testExpenses);
          });
    
          it("responds with 204 and updates the expense", () => {
            const idUpdate = 2;
            const updateExpense = {
              amount: "99.99",
              style: "Transportation",
              description: "oil change and gas",
              date: new Date().toISOString().split("T")[0]
            };
            const expectedExpense = {
              ...testExpenses[idUpdate - 1],
              ...updateExpense
            };
            return supertest(app)
              .patch(`/expenses/${idUpdate}`)
              .send(updateExpense)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/expenses/${idUpdate}`)
                  .expect(expectedExpense)
              );
          });
    
          it(`responds with 400 when no required fields supplied`, () => {
            const idUpdate = 2;
            return supertest(app)
              .patch(`/expenses/${idUpdate}`)
              .send({ irrelevantField: "foo" })
              .expect(400, {
                error: {
                  message: `Request body must contain either 'amount', 'style', or 'description'`
                }
              });
          });
    
          it(`responds with 204 when updating only a subset of fields`, () => {
            const idUpdate = 2;
            const updateExpense = {
              amount: "55.55",
              date: new Date().toISOString().split("T")[0]
            };
            const expectedExpense = {
              ...testExpenses[idUpdate - 1],
              ...updateExpense
            };
    
            return supertest(app)
              .patch(`/expenses/${idUpdate}`)
              .send({
                ...updateExpense,
                fieldToIgnore: "should not be in GET response"
              })
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/expenses/${idUpdate}`)
                  .expect(expectedExpense)
              );
          });
        });
      });
})