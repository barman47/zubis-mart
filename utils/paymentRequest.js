module.exports = (user) => {
    // if (user.paymentRequest === false && user.hasPaid === true) {
    //     return false;
    // } else {
    //     return true;
    // }
    let result;
    (user.paymentRequest === false && user.hasPaid === true) ? result = false : result = true;
    return result;
     
}