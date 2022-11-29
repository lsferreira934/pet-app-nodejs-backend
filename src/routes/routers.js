const express = require('express');
const authRouter = require('./auth_router');
const petRouter = require('./pet_router')

const router = express.Router();

const apiVersion = '/-/v1'

router.use(apiVersion, [
    authRouter,
    petRouter
]);


module.exports = router;