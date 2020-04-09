function makeExpensesArray() {
    return [
        {
            id: 1,
            amount: "9.99",
            description: "Monday morning breakfast",
            date: "2020-03-29",
            style: "Food",
          },
          {
            id: 2,
            amount: "50.00",
            description: "Train ticket",
            date: "2020-03-29",
            style: "Transportation",
          },
          {
            id: 3,
            amount: "200.95",
            description: "Property tax",
            date: "2020-03-29",
            style: "Bills or Loans",
          },
    ];
}

module.exports = {
    makeExpensesArray,
}