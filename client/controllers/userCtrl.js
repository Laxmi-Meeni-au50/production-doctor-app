const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel');
const appointmentsModel = require('../models/appointmentsModel');
const moment = require('moment');
//register handler
const registerControllers = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(200).send({ message: 'user already exist', success: false })
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({ message: `registered successfully`, success: true })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `register controller ${error.message}`
        })
    }
};
//login handler
const loginControllers = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: `user not found`, success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: `invalid email or password`, success: false })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT, { expiresIn: '1d' })
        res.status(200).send({ message: `Login Successfull`, success: true, token })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `error in login controller ${error.message}` })
    }

};
//authentication handler
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'user not found',
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Authentication error ${error}`
        })
    }
}
//apply-doctor controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;
        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for new Doctor's Position`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            },
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({
            success: true,
            message: 'Doctor Post Applied Successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while applying for doctor`
        })
    }

}

//get notification controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const seenotification = user.seenotification;
        const notification = user.notification;
        seenotification.push(...notification);
        user.notification = [];
        user.seenotification = notification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "all notification's marked as read",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in notifications",
            error,
        });
    }
};
//delete notification controller
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seenotification = [];
        const updateUser = await user.save();
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notification's deleted successfully",
            data: updateUser,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to delete all notifications",
            error,
        });
    }
}

//get all doctors
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).send({
            success: true,
            message: "All doctor's list fetched successfully",
            data: doctors,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to get all doctors",
            error,
        });
    }
}
// book appointments
const bookappointmentsController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();

        req.body.status = 'pending';
        const newAppointment = new appointmentsModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInformation.userId });
        user.notification.push({
            type: 'new-appointment-request',
            message: `A New Appointment Booking request from ${req.body.userInformation.name}`
            ,
            onClickPath: '/user/appointments'
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Appointment Booked Successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to book doctor's appointments",
            error,
        });
    }
}

//booking availabity of doc
const bookingavailabillityController = async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentsModel.find({
            doctorId, date,
            time: {
                $gte: fromTime, $lte: toTime
            }
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: 'Appointment Unavailable at this time',
                success: true,
            })
        } else {
            return res.status(200).send({
                message: 'Appointment Available',
                success: true,
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to check doctor's availability",
            error,
        });
    }
}


const userappointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentsModel.find({ userId: req.body.userId });
        res.status(200).send({
            message: ' Users Appointment fetched successfully',
            success: true,
            data: appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to check user appointments's availability",
            error,
        });
    }
}
module.exports = {
    registerControllers, loginControllers, authController, applyDoctorController, getAllNotificationController,
    deleteAllNotificationController, getAllDoctorsController, bookappointmentsController, bookingavailabillityController, userappointmentsController
}