const moment = require('moment');

module.exports = (time) => {
    if (time) {
        const endDate = moment(time).add(1, 'month');
        const expires = moment(endDate).fromNow();
        return expires;
    }
}