const RepoRealty = require('../repository/Realty');
const UploadImageProductService = require('../services/UploadImageProductService');
module.exports = class Home {
    print(req, res) {
        let repo = new RepoRealty();
        repo.find().then((realties) => {
            const UploadImageProduct = new UploadImageProductService();
            realties = realties.map((realty) => {
                realty.pictures = UploadImageProduct.getPictures(realty.id);
                return realty;
            });
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
