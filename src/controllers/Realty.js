const RepoRealty = require('../repository/Realty');
const UploadImageProductService = require('../services/UploadImageProductService');
module.exports = class Realty {
    print(request, response) {
        if(typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');  
        }
        let repo = new RepoRealty();
        repo.find().then((realties) => {
            response.render('admin/realty/list', {realties});
        });
    }

    printForm(request, response) {
        if(typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');  
        }

        if(typeof request.params.id != 'undefined'  && request.params.id != '') {
            let repo = new RepoRealty();
            repo.findById(request.params.id).then((realty) => {
                response.render('admin/realty/form', { form : realty });
            },() => {
                request.flash('error', 'Une erreur est survenue.');
                response.redirect('/admin/realty');
            });
        }
        else {
            response.render('admin/realty/form', { form : { address : {}, contact : {}}});
        }
    }

    processForm(request, response) {  
        if(typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');  
        }
        const entity = request.body.realty || {};
        entity.agent_immobilier = request.session.user;
        entity.address = request.body.address || {};
        entity.contact = request.body.contact || {};

        const repo = new RepoRealty();
        let save;
        if(typeof request.params.id != 'undefined'  && request.params.id != '') {
            save = repo.update(request.params.id, entity);
        }
        else {
            save = repo.add(entity);
        }
        
        save.then((realty) => {
            if(typeof request.params.id != 'undefined'  && request.params.id != '') {
                request.flash('notify', 'Le bien a été modifié.');
            } else {
                request.flash('notify', 'Le bien a été créé.');
            }

            // Gestions d'upload des photos ici
            let photos = [];
            // Enregistrement des images
            if(typeof request.files != 'undefined' && request.files != null) {
                if(typeof request.files.photos[0] === 'undefined') {
                    request.files.photos = [request.files.photos];
                }
                const UploadImageProduct = new UploadImageProductService();
                if(typeof request.files.photos != 'undefined' && request.files.photos.length > 0) {
                    
                    Object.values(request.files.photos).forEach(file => {
                        photos.push(UploadImageProduct.moveFile(file, realty._id));
                    });
                }                                
            }
            Promise.all(photos).then((values) => {
                console.log(values);
                response.redirect('/admin/realty');
            });
        }, (err) => {
            response.render('admin/realty/form', { 
                error : `L'enregistrement en base de données a échoué`, 
                form : entity 
            }); 
        });

    }

    delete(request, response) {
        if(typeof request.session === 'undefined' || typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');  
            return;
        }
 
        if(typeof request.params.id != 'undefined'  && request.params.id != '') 
        {
            let repo = new RepoRealty();
            repo.delete({_id : request.params.id}).then(() => {
                request.flash('notify', 'Le bien a été supprimé.');
                response.redirect('/admin/realty');
            }, () => {
                request.flash('error', 'La suppression du bien a échoué.');
                response.redirect('/admin/realty');
            });  
        } 
        else {
            request.flash('error', 'Une erreur est survenue.');
            response.redirect('/admin/realty');
        }
    }

};
  