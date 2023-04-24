const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//------for deployment 
const path = require('path');
//------for deployment 




//dot env config
dotenv.config()

//mongodb connection
connectDB();
//rest obj
const app = express();
//middleware
app.use(express.json());
app.use(morgan('dev'));

//routes
// app.get('/', (req, res) => { res.status(200).send({ message: "server is running" }) });

app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));

//-------static files for deployment
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});
//-------static files for deployment



//listen port
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`server is running at ${process.env.NODE_MODE} mode on port ${process.env.PORT}`)
})