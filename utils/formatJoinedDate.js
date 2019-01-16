const moment = require('moment');
module.exports = (date) => {
    const formatedDate = moment(date).format('MMMM Do YYYY');
    return formatedDate;
};