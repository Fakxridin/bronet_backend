const Joi = require('joi');
const Role = require('../../utils/userRoles.utils');

exports.userSchemas = {
  create: Joi.object({
    username: Joi.string().required().min(3).max(25),
    fullname: Joi.string().required().min(3).max(50),
    role: Joi.string().valid(Role.Admin, Role.SuperAdmin, Role.Teacher, Role.Cashier, Role.Student, Role.Programmer).required(),
    password: Joi.string().min(3).required().label('Password'),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
      .required()
      .label('Parolni tasdiqlang')
      .messages({ 'any.only': '{{#label}} mos kelmadi' })
  }),

  update: Joi.object({
    username: Joi.string().required().min(3).max(25),
    fullname: Joi.string().required().min(3).max(50),
    role: Joi.string().valid(Role.Admin, Role.SuperAdmin, Role.Teacher, Role.Cashier, Role.Student, Role.Programmer).required(),
    branch_id: Joi.number().required().label('Filial kiriting'),
    password: Joi.string().min(3).label('Password').empty(''),
    confirmPassword: Joi.any().equal(Joi.ref('password')).empty('')
      .label('Parolni tasdiqlang')
      .messages({ 'any.only': '{{#label}} mos kelmadi' })
  }),

  login: Joi.object({
    username: Joi.string().empty(''),
    password: Joi.string().required(),
  }),
};

