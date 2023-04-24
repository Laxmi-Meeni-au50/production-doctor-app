const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInformationController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateAppointmentStatusController } = require('../controllers/doctorCtrl');
const router = express.Router();
//post doctor's information
router.post('/getDoctorInfo', authMiddleware, getDoctorInformationController);
//post update profile
router.post('/updateProfile', authMiddleware, updateProfileController);
//post getting single doc info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

//to get appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController)
//post update appointment status
router.post('/update-appointment-status', authMiddleware, updateAppointmentStatusController)

module.exports = router;