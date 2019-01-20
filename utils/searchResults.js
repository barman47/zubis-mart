module.exports = (products, services) => {
    if ((products.length === undefined || products.length === 0)  && (services.length === undefined || services.length === 0)) {
        return false;
    } else {
        return true;
    }
};