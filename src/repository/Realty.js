require('../../app/database.js');
const mongoose = require('mongoose');
const RealtySchema = mongoose.Schema({
    type:  {type: String, match: /^[1-6]{1}$/},
    price: { type: Number },
    amount_commission: { type: Number },
    percentage_commission: { type: Number },
    area: { type: Number },
    room: { type: Number },
    type_product: {type: String, match: /^[1-3]{1}$/},
    info_realty: { type: String },
    address: {
      seller: { type: String },
      address1: { type: String },
      address2: { type: String },
      zipcode: { type: String },
      city: { type: String },
      info_address: { type: String },
    },
    contact: {
      civility:  {type: String, match: /^[1-2]{1}$/},
      lastname: { type: String },
      firstname: { type: String },
      email: { type: String },
      mobile: { type: String },
      phone: { type: String },
      info: { type: String },
    }
}, { versionKey: false });
 

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
} 
