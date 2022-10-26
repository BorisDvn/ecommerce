const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// LOGIN
router.post('/login', [helper.hasAuthFields, helper.isPasswordAndUserMatch], (req, res) => {
    /*
       #swagger.tags = ["authentication"]
       #swagger.description = 'LOGIN'
       #swagger.parameters['user'] = {
           in: 'body',
           description: 'user for login',
           schema: {
                email: 'user@email.com',
                password: '************'
            }
        }
        #swagger.responses[200] = {
            description: 'user log',
            schema: {
                token: '****************************',
                auth: true,
                email: 'user@mail.com',
                firstName: 'firstName',
                lastName: 'lastName',
                photoUrl: 'photoUrl.ulr.com',
                id: 0
            }
        } */

    let token = jwt.sign({state: 'true', email: req.body.email}, helper.secret, {
        algorithm: 'HS512',
        expiresIn: '1h'
    });

    res.json(Object.assign({token, auth: true}, { // body from isPasswordAndUserMatch
        email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName,
        photoUrl: req.body.photoUrl, id: req.body.id
    }));
});

// REGISTER
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({min: 6}).withMessage("must be 6 characters long"),
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
      #swagger.tags = ["authentication"]
      #swagger.description = 'REGISTER'
      #swagger.parameters['user'] = {
          in: 'body',
          description: 'user for login',
          schema: {
            email : 'user@email.com',
             password : '***********',
             fname : 'Leo',
             lname : 'Edward'
          }
       }
       #swagger.responses[201] = {
            description: 'User successfully reg.',
            schema: {message: 'Registration successful.'}
       }
       #swagger.responses[433] = {
            description: 'User reg error'
       }
       #swagger.responses[501] = {
            description: 'User reg failed',
            schema: {message: 'Registration failed.'}
       }
    */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        let email = req.body.email;
        let username = email.split("@")[0];
        let password = await bcrypt.hash(req.body.password, 10);
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;

        /**
         * ROLE 777 = ADMIN
         * ROLE 555 = CUSTOMER
         **/
        helper.database.table('users').insert({
            username: username,
            password: password,
            email: email,
            role: 555,
            lname: firstname,
            fname: lastname
        }).then(lastId => {
            if (lastId.insertId > 0) {
                res.status(201).json({id: lastId.insertId, message: 'Registration successful.'});
            } else {
                res.status(501).json({message: 'Registration failed.'});
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});

module.exports = router;
