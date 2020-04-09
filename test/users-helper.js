const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        full_name: 'Test user 1',
        password: 'password',
        date_created: new Date("2029-01-20T16:28:32.615Z")
      },
      {
        id: 2,
        user_name: 'test-user-2',
        full_name: 'Test user 2',
        password: 'password',
        date_created: new Date("2029-01-21T17:28:32.615Z")
      },
      {
        id: 3,
        user_name: 'test-user-3',
        full_name: 'Test user 3',
        password: 'password',
        date_created: new Date("2029-01-22T18:28:32.615Z")
      },
      {
        id: 4,
        user_name: 'test-user-4',
        full_name: 'Test user 4',
        password: 'password',
        date_created: new Date("2029-01-23T19:28:32.615Z")
      }
    ];
}
  
function makeExpensesArray() {
    return [
      {
        id: 1,
        amount: "12.99",
        style: "Food",
        description: "Starbucks before work",
        date: new Date().toDateString()
      },
      {
        id: 2,
        amount: "40.00",
        style: "Transportation",
        description: "Oil change",
        date: new Date().toDateString()
      },
      {
        id: 3,
        amount: "200.50",
        style: "Bills",
        description: "Electricity Bill",
        date: new Date().toDateString()
      }
    ];
}
  
function makeExpectedExpense(users, expense) {
      return {
          id: expense.id,
          date: expense.date,
          amount: expense.amount,
          style: expense.style,
          description: expense.description
      }
}
  
function makeMaliciousExpense(user) {
    const maliciousExpense = {
      id: 911,
      style: "How-to",
      date: new Date(),
      amount: 'Naughty naughty very naughty <script>alert("xss");</script>',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    };
    const expectedExpense = {
      ...makeExpectedExpense([user], maliciousExpense),
      title:
        'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };
    return {
      maliciousExpense,
      expectedExpense
    };
}
  
function makeExpensesFixtures() {
    const testUsers = makeUsersArray()
    const testExpenses = makeExpensesArray(testUsers)
    return { testUsers, testExpenses,}
}
  
function cleanTables(db) {
    return db.transaction(trx =>
      trx
        .raw(
          `TRUNCATE
          expense_logs,
          users
        `
        )
        .then(() =>
          Promise.all([
            trx.raw(
              `ALTER SEQUENCE expense_logs_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(
              `ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(`SELECT setval('expense_logs_id_seq', 0)`),
            trx.raw(`SELECT setval('users_id_seq', 0)`),
          ])
        )
    );
}
  
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }));
    return db
      .into('users')
      .insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(`SELECT setval('users_id_seq', ?)`, [
          users[users.length - 1].id
        ])
      );
}
  
function seedExpensesTables(db, users, expenses, ) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('expense_logs').insert(expenses)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('expense_logs_id_seq', ?)`,
        [expenses[expenses.length - 1].id],
      )
  
    })
}
  
function seedMaliciousExpense(db, user, expense) {
    return seedUsers(db, [user]).then(() =>
      db.into("expense_logs").insert([expense])
    );
}
  
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: "HS256"
    });
  
    return `Bearer ${token}`;
}
  
module.exports = {
    makeUsersArray,
    makeExpensesArray,
    makeExpectedExpense,
    makeMaliciousExpense,
  
    makeExpensesFixtures,
    cleanTables,
    seedExpensesTables,
    seedMaliciousExpense,
    seedUsers,
    makeAuthHeader,
}