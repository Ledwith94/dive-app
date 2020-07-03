const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

 router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect:'login-success'}))

 router.post('/register', (req, res, next) => {
    User.findOne({username:req.body.username})
    .exec(function(error, result) {
    if (result !== null){
        console.log("Username Exists")
    }
    else {
    const saltHash = genPassword(req.body.password)
    const salt = saltHash.salt
    const hash = saltHash.hash

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt:salt
    })

    newUser.save()
    res.redirect('/login')
    }
    })
 });


 /**
 * -------------- GET ROUTES ----------------
 **/

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p><p>Please <a href="/login">login</a></p>');
});

router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

router.get('/protected-route', (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findById(req.user._id)
            .exec(function(error, result) {
            if (error) return console.error(error)
            else res.status(200).send(result)
        })
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

router.get('/update', (req, res, next) =>{
    if (req.isAuthenticated()) {
        const form = '<h1>Update Profile</h1><form method="post" action="update">\
                    First Name:<br><input type="text" name="firstName">\
                    <br>Last Name:<br><input type="text" name="lastName">\
                    <br><br><input type="submit" value="Submit"></form>';
        res.send(form);
    }
    else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
})

router.post('/update', (req, res, next) =>{ 
    const userUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
    if (req.isAuthenticated()) {
        User.findByIdAndUpdate(req.user._id, userUpdate)
            .exec(function(error, result) {
            if (error) return console.error(error)
            else res.send(result)
        })
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/login-success', (req, res, next) => {
    res.status(200).redirect('/protected-route')
});

router.get('/login-failure', (req, res, next) => {
    res.status(404).send('<p>Incorrect Email/Password Combination</p>');
});

module.exports = router;