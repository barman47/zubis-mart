module.exports =  (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } 
    req.flash('failure', 'Please Login to view that Page');
    res.redirect('/admin/login');
}