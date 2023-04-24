const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');

const getAllUserController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({
            success: true,
            message: `Users Data List`,
            data: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while fetching users data`
        });
    }
};
const getAllDoctorController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: `Doctors Data List`,
            data: doctors,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while fetching doctors data`
        });
    }
};
//doctor account status
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId })
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your Doctor Account Request Has been ${status}`,
            onClickPath: '/notification',
        });
        user.isDoctor = status === 'approved' ? (true) : (false);
        await user.save();
        res.status(201).send({
            success: true,
            message: `Account Status Updated`,
            data: doctor,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while updating doctors status`
        });
    }
}
module.exports = { getAllUserController, getAllDoctorController, changeAccountStatusController }