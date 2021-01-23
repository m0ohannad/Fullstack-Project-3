const crypto = require('crypto');

const hashPassword = (Password, salt = 'secret') => {
    return crypto.createHmac('sha256', salt).update(Password).digest('hex');
}

export {
    hashPassword
}