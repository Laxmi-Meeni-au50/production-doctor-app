const express = require('express');
const { loginControllers, registerControllers, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookappointmentsController, bookingavailabillityController, userappointmentsController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router = express.Router();
//routes
//login with post method
router.post('/login', loginControllers)
//register with post method
router.post('/register', registerControllers)
//authentication with post method
router.post('/getUserData', authMiddleware, authController)
module.exports = router
//apply doctor with post method
router.post('/apply-doctor', authMiddleware, applyDoctorController);
//Notifiaction  Doctor || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
//apply doctor with post method
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

//get all doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//book appointments
router.post('/book-appointments', authMiddleware, bookappointmentsController);
//check doc availability
router.post('/booking-availabillity', authMiddleware, bookingavailabillityController);

//appointments list
router.get('/user-appointments', authMiddleware, userappointmentsController);



module.exports = router

