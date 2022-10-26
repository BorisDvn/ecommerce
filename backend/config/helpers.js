const Mysqli = require('mysqli');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let conn = new Mysqli({
    host: process.env.MYSQL_HOST || "localhost",
    post: 3306,
    user: 'root',
    passwd: 'MYSQL_ROOT_PASSWORD',
    db: 'mega_shop'
});

let db = conn.emit(false, 'mega_shop');

const secret = "segebezt665416erv1rtz6e46rger64"; // todo Hide !?

module.exports = {
    database: db, secret: secret,
    validJWTNeeded: (req, res, next) => {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    req.jwt = jwt.verify(authorization[1], secret);
                    return next();
                }
            } catch (err) {
                return res.status(403).send("Authentication failed");
            }
        } else {
            return res.status(401).send("No authorization header found.");
        }
    }, hasAuthFields: (req, res, next) => {
        let errors = [];

        if (req.body) {
            if (!req.body.email) {
                errors.push('Missing email field');
            }
            if (!req.body.password) {
                errors.push('Missing password field');
            }

            if (errors.length) {
                return res.status(400).send({errors: errors.join(',')});
            } else {
                return next();
            }
        } else {
            return res.status(400).send({errors: 'Missing email and password fields'});
        }
    }, isPasswordAndUserMatch: async (req, res, next) => {
        const myPlaintextPassword = req.body.password;
        const myEmail = req.body.email;

        const user = await db.table('users').filter({$or: [{email: myEmail}, {username: myEmail.toString().split("@")[0]}]}).get();

        if (user) {
            const match = await bcrypt.compare(myPlaintextPassword, user.password);

            if (match) {
                req.body.username = user.username;
                req.body.email = user.email;
                req.body.firstName = user.fname;
                req.body.lastName = user.lname;
                req.body.photoUrl = user.photoUrl;
                req.body.id = user.id;
                next();
            } else {
                res.status(401).send("Username or password incorrect");
            }

        } else {
            res.status(401).send("Username or password incorrect");
        }
    }
};
