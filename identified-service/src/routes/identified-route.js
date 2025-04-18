const router = require('express').Router();
const controller = require('../controller/identified-controller');
router.post('/register',controller.userRegister);
module.exports = router;