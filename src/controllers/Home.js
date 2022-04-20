const RepoRealty = require('../repository/Realty');
module.exports = class Home {
    print(req, res) {
        let repo = new RepoRealty();
        repo.find().then((realties) => {
            res.render('home', {realties});
        });
    }
};
