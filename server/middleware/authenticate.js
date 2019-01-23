const {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject(); // go to catch case
        }

        //res.send(user);
        // alter the request object
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(); // 401 = authentication required
    })
}

module.exports = {authenticate};