const express = require('express');
const authRouter = express.Router();

const mwCheckDuplicateUser = require('../middlewares/mwCheckDuplicateUser');
const mwCheckRoleExisted = require('../middlewares/mwCheckRoleExisted');
const mwCheckTokenIsValid = require('../middlewares/mwCheckTokenIsValid')

const authController = require('../controllers/authControllers');


authRouter.post('/signin', authController.signin);

authRouter.post('/signup', [
    mwCheckRoleExisted,
    mwCheckDuplicateUser
], authController.signup);

authRouter.post('/logoff', mwCheckTokenIsValid, authController.logoff)


module.exports = authRouter;