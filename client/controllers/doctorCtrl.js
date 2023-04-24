const appointmentsModel = require('../models/appointmentsModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');
const getDoctorInformationController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: `Doctor's data fetched successfully`,
            data: doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while fetching doctor's details`
        });
    }
};
//update doctor profile

const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: `Doctor's Profile Updated successfully`,
            data: doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while updating doctor's profile`
        });
    }
}
//get single doctor data
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: `Doctor's data fetched successfully`,
            data: doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while getting doctor's data`
        });
    }
}

//doctors appointments controller
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentsModel.find({ doctorId: doctor._id });
        res.status(200).send({
            success: true,
            message: `Doctor's Appointment fetched successfully`,
            data: appointments,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while getting doctor's appointments`
        });
    }
}
//
const updateAppointmentStatusController = async (req, res) => {
    try {

        const { appointmentsId, status } = req.body;
        const appointments = await appointmentsModel.findByIdAndUpdate(appointmentsId, { status })
        const user = await userModel.findOne({ _id: appointments.userId });
        const notification = user.notification;
        notification.push({
            type: 'update-appointment-status',
            message: `Appointment status updated ${status}`
            ,
            onClickPath: '/doctor-appointments'
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Appointments status Updated successfully',

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while updating doctor's appointments status`
        });
    }
}

module.exports = {
    getDoctorInformationController, updateProfileController, getDoctorByIdController, doctorAppointmentsController,
    updateAppointmentStatusController
}