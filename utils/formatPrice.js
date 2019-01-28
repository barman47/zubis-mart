const numeral = require('numeral');
module.exports = (price) => {
    if (price) {
        const newPrice = numeral(price).format();
        return newPrice;
    } else {
        return 0;
    }
};