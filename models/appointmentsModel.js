const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    doctorInformation: {
        type: String,
        required: true
    },
    userInformation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },



}, { timestamps: true });
const appointmentsModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentsModel;