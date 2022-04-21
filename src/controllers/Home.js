const RepoRealty = require('../repository/Realty');
module.exports = class Home {
    print(req, res) {
        let repo = new RepoRealty();
        repo.find().then((realties) => {
            res.render('home', {realties});
        });
    }

    printRealty(req, res) {
        if(typeof req.params.slug != 'undefined'  && req.params.slug != '') {
            let repo = new RepoRealty();
            repo.find({slug : req.params.slug}).then((realty) => {
                res.render('realty', { realty : realty[0] });
            },() => {
                req.flash('error', 'Une erreur est survenue.');
                res.redirect('/');
            });
        }
    }
};
