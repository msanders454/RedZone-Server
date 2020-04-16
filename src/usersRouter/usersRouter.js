const path = require('path');
const userService = require('./userservice');
const express = require('express');
const usersRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');


/*
* Users Router. /api/users.
*/ 
usersRouter 
    .route('/')
/*
* Recieves all information for all users.
*/ 
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        userService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(userService.serializeUser))
            })
            .catch(next)
    })
/*
*Adds new users.
*/
    .post(jsonParser, (req, res, next) => {

        const { password, user_name, full_name, red_zone_amount} = req.body;

        for (const field of ["full_name", "user_name", "password", "red_zone_amount"])
          if (!req.body[field])
            return res.status(400).json({
              error: { message:`Missing '${field}' in request body` }
            });

            const passwordError = userService.validatePassword(password);

            if (passwordError)
              return res.status(400).json({ error: passwordError });
   
              userService.hasUserWithUserName(
               req.app.get('db'),
               user_name
           )
               .then(hasUserWithUserName => {
                   if (hasUserWithUserName)
                       return res.status(400).json({ error: `Username already taken` })
   
               return userService.hashPassword(password)
                   .then(hashedPassword => {
                       const newUser = {
                         user_name,
                         password: hashedPassword,
                         full_name,
                         date_created: "now()",
                         red_zone_amount,
                       }
                       
                       return userService.insertUser(
                         req.app.get("db"),
                         newUser
                       ).then(user => {
                         res
                           .status(201)
                           .location(
                             path.posix.join(req.originalUrl, `/${user.id}`)
                           )
                           .json(userService.serializeUser(user));
                       });
                   })
               })
               .catch(next)
       })
/*
* Users Router. /api/users/:user_name.
*/ 
   usersRouter
       .route('/:user_name')
       .all((req, res, next) => {
        userService.getByuser_name(
               req.app.get('db'),
               req.params.user_name
           )
               .then(user => {
                   if (!user) {
                       return res.status(404).json({
                           error: { message: `User doesn't exist` }
                       })
                   }
                   res.user = user
                   next()
               })
               .catch(next)
       })
/*
* Recieves information for the specific user.
*/ 
       .get((req, res, next) => {
           res.json(userService.serializeUser(res.user))
       })
/*
* Deletes information for the specific user.
*/
       .delete((req, res, next) => {
        userService.deleteUser(
               req.app.get('db'),
               req.params.user_name
           )
               .then(numRowsAffected => {
                   res.status(204).end()
               })
               .catch(next)
       })
/*
* Edits information for the specific user.
*/
       .patch(jsonParser, (req, res, next) => {
           const { full_name, user_name, password,  } = req.body
           const userToUpdate = { full_name, user_name, password }
   
           const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
           if (numberOfValues === 0)
               return res.status(400).json({
                   error: {
                       message: `Request body must contain either 'full_name', 'user_name', or 'password'`
                   }
               })
   
               userService.updateUser(
               req.app.get('db'),
               req.params.user_name,
               userToUpdate
           )
               .then(numRowsAffected => {
                   res.status(204).end()
               })
               .catch(next)
       })
/*
* Users Router. /api/users/patch/:user_id
* This route is just for patching users red zone amount
*/
  usersRouter
       .route('/patch/:user_id')
       .all((req, res, next) => {
        userService.getByID(
               req.app.get('db'),
               req.params.user_id
           )
               .then(user => {
                   console.log(user)
                   if (!user) {
                       return res.status(404).json({
                           error: { message: `User like me` }
                       })
                   }
                   res.user = user
                   next()
               })
               .catch(next)
       })
       .get((req, res, next) => {
           res.json(userService.serializeUser(res.user))
       })
       .patch(jsonParser, (req, res, next) => {
           const { red_zone_amount  } = req.body
           const userToUpdate = { red_zone_amount }
   
           const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
           if (numberOfValues === 0)
               return res.status(400).json({
                   error: {
                       message: `Request body must contain either 'full_name', 'user_name', or 'password'`
                   }
               })
   
               userService.updateUser(
               req.app.get('db'),
               req.params.user_id,
               userToUpdate
           )
               .then(numRowsAffected => {
                   res.json(userService.serializeUser(res.user))
               })
               .catch(next)
       })
   
   module.exports = usersRouter;