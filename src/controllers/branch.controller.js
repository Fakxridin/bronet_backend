const BranchModel = require('../models/branch.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

/******************************************************************************
 *                              Branch Controller
 ******************************************************************************/
class BranchController extends BaseController {
    // Get all branches
    getAll = async (req, res, next) => {
        let branchList = await BranchModel.findAll({
            order: [
                ['name', 'ASC'],
                ['id', 'ASC']
            ]
        });

        res.send(branchList);
    };

    // Get a branch by its ID
    getById = async (req, res, next) => {
        const branch = await BranchModel.findOne({
            where: { id: req.params.id }
        });

        if (!branch) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(branch);
    };

    // Create a new branch
    create = async (req, res, next) => {
        this.checkValidation(req);

        let { name, address } = req.body;

        const newBranch = await BranchModel.create({
            name,
            address
        });

        if (!newBranch) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(newBranch);
    };

    // Update an existing branch
    update = async (req, res, next) => {
        this.checkValidation(req);

        let { name, address } = req.body;

        const branch = await BranchModel.findOne({ where: { id: req.params.id } });

        if (!branch) {
            throw new HttpException(404, req.mf('data not found'));
        }

        branch.name = name;
        branch.address = address;

        await branch.save();

        res.send(branch);
    };

    // Delete a branch
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
module.exports = new BranchController;
