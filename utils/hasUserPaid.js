module.exports = (user) => { 
    if (user.hasPaid === true) {
        return 'checked';
    }
};