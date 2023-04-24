const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUserController, getAllDoctorController, changeAccountStatusController } = require('../controllers/adminCtrl');
const router = express.Router();
//get method for user
router.get('/getAllUsers', authMiddleware, getAllUserController);
//get method for doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorController)
//post method for changing account status
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)
module.exports = router;

