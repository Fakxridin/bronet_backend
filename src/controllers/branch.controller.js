const BranchModel = require('../models/branch.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');

/******************************************************************************
 *                              Branch Controller
 ******************************************************************************/
class BranchController extends BaseController {
    getAll = async (req, res, next) => {
        const branches = await BranchModel.findAll({
            order: [
                ['name', 'ASC'],
                ['id', 'ASC']
            ]
        });
        res.send(branches);
    };

    getById = async (req, res, next) => {
        const branch = await BranchModel.findOne({ where: { id: req.params.id } });

        if (!branch) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(branch);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const { name, address } = req.body;

        const branch = await BranchModel.create({
            name,
            address
        });

        if (!branch) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(branch);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const branch = await BranchModel.findOne({ where: { id: req.params.id } });

        if (!branch) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const { name, address } = req.body;

        branch.name = name;
        branch.address = address;

        await branch.save();

        res.send(branch);
    };

    delete = async (req, res, next) => {
        const branch = await BranchModel.findOne({ where: { id: req.params.id } });

        if (!branch) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            await branch.destroy({ force: true });
        } catch (error) {
            await branch.destroy();
        }

        res.send(req.mf('data has been deleted'));
    };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new BranchController();
