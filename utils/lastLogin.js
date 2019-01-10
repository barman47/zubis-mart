const moment = require('moment');

module.exports = (time) => {
    if (time) {
        const lastLogin = moment(time).fromNow();
        return lastLogin;
    }
}