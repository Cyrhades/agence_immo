require('../../app/database.js');
const mongoose = require('mongoose');
const RealtySchema = require('./RealtySchema.js');
 
module.exports = class Realty {
    constructor() {
        this.db = mongoose.model('Realty', RealtySchema); 
    }
 
    add(entity) {
        return new Promise((resolve, reject) => {
            this.db.create(entity, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    find(search = {}) {
        return new Promise((resolve, reject) => {
            this.db.find(search, function (err, realty) {
                if (err) reject(err);
                resolve(realty);
            });
        });
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            this.db.findById(id, function (err, realty) {
                if (err || realty === null) reject(err);
                resolve(realty);
            });
        });
    }

    update(id, entity) {
        return new Promise((resolve, reject) => {
            this.db.findByIdAndUpdate(id, entity, function (err, realty) {
                if (err || realty === null) reject(err);
                resolve(realty);
            });
        });
    }

    delete(filter = {}) {
        return new Promise((resolve, reject) => {
            this.db.deleteOne(filter, function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    }

} 
