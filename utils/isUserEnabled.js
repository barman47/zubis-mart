module.exports = (user) => { 
    if (user.enabled === true) {
        return 'checked';
    }
};