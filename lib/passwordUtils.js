const crypto = require('crypto');

// TODO
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
    return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex')
    console.log(password)
    var genHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')

    return{
        salt: salt,
        hash: genHash
    }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;