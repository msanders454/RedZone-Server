

## THe RedZone

“Remember to avoid the RedZone”

### `The Idea`

When life gets complicated, sometimes when overspend our budget without realizing. Days later we find out that we are out of money for groceries. The Horror. This app allows users to create a budget and find out if they are in the danger zone. Well, we like to call it the RedZone

Users will create an account and set up thier budget amount. They can then add expenses to their account and if they enter the danger zone, they will be notified. Remember to avoid the RedZone. This app will help users see exactly where they are on their budget and figure out how much they are spending on an item.

### Demo

[Live Page](red-zone-client.now.sh)

### Demo Log in

### Client-side code

[Client-side code](https://github.com/msanders454/Red-Zone-Client)

### `Screen Shots`

![Login Page](https://github.com/msanders454/Red-Zone-Client/blob/master/src/Images/Loginpage.png)
![Expense List Page](https://github.com/msanders454/Red-Zone-Client/blob/master/src/Images/Expenselist.PNG)
![Add Expense Page](https://github.com/msanders454/Red-Zone-Client/blob/master/src/Images/AddExpense.PNG)
![Statistics/ RedZone Alert Page](https://github.com/msanders454/Red-Zone-Client/blob/msaster/src/Images/Statistics.PNG)


###Endpoints

This api is used to store user account information as well a expense information.

##users
- POST /api/users
Verifies 4 inputs (password, user_name, full_name, red_zone_amount) and creates a new user

- GET /api/users/:user_name
Returns an array with only user_name's data.

- DELETE /api/users/:user_name
Deleted the array with only user_name's data.

- PATCH /api/users/:user_name
Updates the array with only user_name's data.

- PATCH /api/users/:user_id
Updates the red zone amount only in user_id's data.



##expenses
- GET /api/expenses
Returns an array with of expense entries.

- POST /api/expenses
Adds a new expense entry to the database.

- GET /api/expenses/:expense_id
Returns an array with only expense_id's data.

- DELETE /api/expenses/:expense_id
Deletes the array with only expense_id's data

- PATCH /api/expenses/:expense_id
Updates the array with only expense_id's data.

- GET /api/expenses/:expense_usernumber
Returns an array with only expense_usernumber's data.

- DELETE /api/expenses/:expense_usernumber
Deletes the array with only expense_id's data

- PATCH /api/expenses/:expense_usernumber
Updates the array with only expense_usernumber's data.



##auth
- POST /api/auth
Verifies input and creates a token key for an existing user.



### Tech Stack

**Front-End**

- HTML
- CSS
- JavaScript
- jQuery

**Back-End**

- Node.js
- Express.js
- Postgres
- Mongoose
- Mocha + Chai

**Others**

- Github
- Heroku

