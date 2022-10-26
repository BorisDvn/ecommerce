const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const {body, validationResult} = require("express-validator");
const helper = require("../config/helpers");

/* GET all users. */
router.get('/', function (req, res) {
    /*
    #swagger.tags = ["users"]
    #swagger.description = 'Fetch all users'
    #swagger.responses[200] = {
        description: 'ALL users',
        schema: {users:[{
            username: 'edward',
            email: 'edward@email.com',
            fname: 'Leo',
            lname: 'Edward',
            age: 18,
            role: 'username',
            id: 0}]}
    }
    */
    database.table('users')
        .withFields(['username', 'email', 'fname', 'lname', 'age', 'role', 'id'])
        .getAll().then((list) => {
        if (list.length > 0) {
            res.json({users: list});
        } else {
            res.json({message: 'NO USER FOUND'});
        }
    }).catch(err => res.json(err));
});

/**
 * ROLE 777 = ADMIN
 * ROLE 555 = CUSTOMER
 */

/* GET ONE USER */
router.get('/:userId', (req, res) => {
    /*
    #swagger.tags = ["users"]
    #swagger.description = 'GET ONE user'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'user ID',
        required: 'true',
        type: 'integer'
     }
     #swagger.responses[200] = {
         description: 'ONE user',
         schema: {
            username: 'edward',
            email: 'edward@email.com',
            fname: 'Leo',
            lname: 'Edward',
            age: 18,
            role: 'username',
            id: 0
         }
     }
    #swagger.responses[404] = {
        description: 'USER NOT FOUND',
        schema: {message: 'USER NOT FOUND'}
    }
    */
    let userId = req.params.userId;
    database.table('users').filter({id: userId})
        .withFields(['username', 'email', 'fname', 'lname', 'age', 'role', 'id'])
        .get().then(user => {
        if (user) {
            res.json({user});
        } else {
            res.status(404).json({message: `USER ${userId} NOT FOUND`});
        }
    }).catch(err => res.json(err));
});

/* UPDATE USER DATA */
router.patch('/:userId', [
    body('email').custom(value => {
        return helper.database.table('users').filter({
            $or:
                [
                    {email: value}, {username: value.split("@")[0]}
                ]
        }).get().then(user => {
            if (user) {
                return Promise.reject('Email / Username already exists, choose another one.');
            }
        })
    })
], async (req, res) => {
    /*
    #swagger.tags = ["users"]
    #swagger.description = 'UPDATE USER DATA'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'user ID',
        required: 'true',
        type: 'integer'
     }
    #swagger.parameters['user'] = {
      in: 'body',
      description: 'user for login',
      schema: {
        username: 'edward',
        email: 'edward@email.com',
        fname: 'Leo',
        lname: 'Edward',
        age: 18,
        role: 'username',
      }
    }
    #swagger.responses[200] = {
     description: 'updated',
        schema: {message: 'User updated successfully'}
    }
    */

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        let userId = req.params.userId;

        // Search User in Database if any
        let user = await database.table('users').filter({id: userId}).get();
        if (user) {

            let userEmail = req.body.email;
            let userPassword = req.body.password;
            let userFirstName = req.body.fname;
            let userLastName = req.body.lname;
            let userUsername = req.body.username;
            let age = req.body.age;

            // Replace the user's information with the form data ( keep the data as is if no info is modified )
            database.table('users').filter({id: userId}).update({
                email: userEmail !== undefined ? userEmail : user.email,
                password: userPassword !== undefined ? userPassword : user.password,
                username: userUsername !== undefined ? userUsername : user.username,
                fname: userFirstName !== undefined ? userFirstName : user.fname,
                lname: userLastName !== undefined ? userLastName : user.lname,
                age: age !== undefined ? age : user.age
            }).then(() => res.json({message: 'User updated successfully'})).catch(err => res.json(err));
        }
    }
});

module.exports = router;
