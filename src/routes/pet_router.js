const express = require('express');
const petRouter = express.Router();

const mwCheckTokenIsValid = require('../middlewares/mwCheckTokenIsValid')

petRouter.get('/pets', mwCheckTokenIsValid, (req, res, next) => {

    res.status(200).json({pet: [
        'cachorro',
        'gato',
        'tartaruga'
    ]})
})


module.exports = petRouter;