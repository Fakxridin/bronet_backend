const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController extends BaseController {
    getAll = async (req, res, next) => {
        let modelList = await UserModel.findAll({
            where: {
                id: { [Op.ne]: MyUser }
            },
            order: [
                ['fullname', 'ASC'],
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const user = await UserModel.findOne({
            where: { id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };

    getByUsername = async (req, res, next) => {
        const user = await UserModel.findOne({ where: { username: req.params.username } });
        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };

    getCurrentUser = async (req, res, next) => {
        res.send(req.currentUser);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let {
            username,
            fullname,
            password,
            role,
            branch_id
        } = req.body;

        const model = await UserModel.create({
            username,
            fullname,
            password,
            role,
            branch_id
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let {
            username,
            fullname,
            password,
            role,
            branch_id
        } = req.body;

        const model = await UserModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.username = username;
        model.fullname = fullname;
        model.branch_id = branch_id;
        if (password) model.password = password;
        model.role = role;
        await model.save();

        res.send(model);
    };

    delete = async (req, res, next) => {
        const model = await UserModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        if (model.id === MainUser) {
            throw new HttpException(400, req.mf('This item cannot be deleted'));
        }

        try {
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }

        res.send(req.mf('data has been deleted'));
    };

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { username, password: pass } = req.body;

        const user = await UserModel.findOne({
            where: {
                username
            }
        });

        if (!user) {
            throw new HttpException(401, req.mf('Incorrect login or password!'));
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, req.mf('Incorrect login or password!'));
        }

        // Generate token
        const token = jwt.sign({
            user_id: user.id.toString(),
            role: user.role,
            branch_id: user.branch_id
        }, secret_jwt, {
            expiresIn: '2400h'
        });

        // Include the token and branch_id in the response
        const userResponse = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            role: user.role,
            branch_id: user.branch_id,  // Explicitly include branch_id
            token: token
        };

        res.send(userResponse);  // Send response with all necessary fields
    };



    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;