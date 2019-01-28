const moment = require('moment');

module.exports = (time) => {
    if (time) {
        const lastPaid = moment(time).fromNow();
        return lastPaid;
    }
}