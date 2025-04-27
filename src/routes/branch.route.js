const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { branchSchemas } = require('../middleware/validators/branchValidator.middleware');  // If you have validation for branch data

// Route for getting all branches (available to all authenticated users)
router.get('/', auth(), awaitHandlerFactory(branchController.getAll));

// Route for getting a branch by ID (available to all authenticated users)
router.get('/:id', auth(), awaitHandlerFactory(branchController.getById));

// Route for creating a new branch (only Programmer and SuperAdmin can create)
router.post('/', auth(Role.Programmer, Role.SuperAdmin), joiMiddleware(branchSchemas.create), awaitHandlerFactory(branchController.create));

// Route for updating a branch (only Programmer and SuperAdmin can update)
router.patch('/:id', auth(Role.Programmer, Role.SuperAdmin), joiMiddleware(branchSchemas.update), awaitHandlerFactory(branchController.update));

// Route for deleting a branch (only Programmer and SuperAdmin can delete)
router.delete('/:id', auth(Role.Programmer, Role.SuperAdmin), awaitHandlerFactory(branchController.delete));
module.exports = router;
