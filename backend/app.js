const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const cors=require("cors")
const path = require("path");
const session=require("express-session");
const mongoDBStore=require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
dotEnv.config();


app.use(express.json())   // to parse the incoming request with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "pug")
app.set("views", path.join(__dirname,"views"))
app.use(cors());
const PORT =  1600;
mongoose.connect(process.env.MONGO_URI)
    .then(async(result) => {
        // console.log(result);
        await app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`)    
        })
        console.log("Data Base is connected... ");
    })
    .catch(err => console.log(err))
    

const store=new mongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:store
}))
const patientRoutes=require('./routes/patientRoutes');
app.use('/api/patient',patientRoutes);
const doctorRoutes=require('./routes/doctorRoutes');
app.use('/api/doctor',doctorRoutes);
