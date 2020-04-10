function makeUsersArray() {
    return [
        {
            id: 1,
            date_created: '2020-04-05',/* new Date('2029-01-22T16:28:32.615Z').toLocaleString('en', { timeZone: 'UTC' }), */
            fullname: 'Shawn Alexander',
            username: 'sAlexander123@gmail.com',
            password: 'secret'
        },
        {
            id: 2,
            date_created: '2020-04-10',/* new Date('2100-05-22T16:28:32.615Z').toLocaleString('en', { timeZone: 'UTC' }), */
            fullname: 'Jesse James',
            username: 'jjames',
            password: 'secret'
        }
    ]
}

module.exports = {
    makeUsersArray
}