const RepoRealty = require('../repository/Realty');
module.exports = class Realty {
    print(request, response) {
        if(typeof request.session.user !== 'undefined') {
            response.render('admin/realty/list');
            return;
        }
       request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
        response.redirect('/connexion');  
    }

    printForm(request, response) {
        response.render('admin/realty/form', { form : { address : {}, contact : {}}});
    }

    processForm(request, response) {  
        const entity = request.body.realty || {};
        entity.address = request.body.address || {};
        entity.contact = request.body.contact || {};
        
        const repo = new RepoRealty();
        repo.add(entity).then((realty) => {
            request.flash('notify', 'Le bien a été créé.');
            response.redirect('/admin/realty');
        }, (err) => {
            response.render('admin/realty/form', { 
                error : `L'enregistrement en base de données a échoué`, 
                form : entity 
            }); 
        });
    }

};
  