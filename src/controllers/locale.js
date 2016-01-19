module.exports.controller = function(app) {

    app.get('/locale/:locale', function(req, res) {
        req.setLocale(req.params.locale);
        res.cookie('locale', req.params.locale);
    });

}
