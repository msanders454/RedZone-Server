function makeUsersArray() {
    return [
        {
            id: 1,
            date_created: '2020-01-05',/* new Date('2029-01-22T16:28:32.615Z').toLocaleString('en', { timeZone: 'UTC' }), */
            fullname: 'George Grant',
            username: 'ggrant123@gmail.com',
            password: 'secret'
        },
        {
            id: 2,
            date_created: '2020-01-10',/* new Date('2100-05-22T16:28:32.615Z').toLocaleString('en', { timeZone: 'UTC' }), */
            fullname: 'Jasmine James',
            username: 'jjames',
            password: 'secret'
        }
    ]
}

module.exports = {
    makeUsersArray
}