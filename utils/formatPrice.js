const numeral = require('numeral');
module.exports = (price) => {
    const newPrice = numeral(price).format();
    return newPrice;
};