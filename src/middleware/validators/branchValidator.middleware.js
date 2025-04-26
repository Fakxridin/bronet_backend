const Joi = require('joi');

exports.branchSchemas = {
    create: Joi.object({
        name: Joi.string().required().min(3).max(50).label('Filial Nomi'),
        address: Joi.string().optional().max(100).label('Manzil')
    }),

    update: Joi.object({
        name: Joi.string().required().min(3).max(50).label('Filial Nomi'),
        address: Joi.string().optional().max(100).label('Manzil')
    })
};
