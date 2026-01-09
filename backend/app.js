const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const { StreamChat } = require('stream-chat');


// Configure dotenv
dotEnv.config();

app.use(express.json()); // to parse the incoming request with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    /\.vercel\.app$/, // Allow Vercel preview deployments
    process.env.FRONTEND_URL // Future production URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const PORT = process.env.PORT || 1600;
mongoose.connect(process.env.MONGO_URI)
  .then(async (result) => {
    // console.log(result);
    // Only start the server if we are running the script directly (not via Vercel serverless)
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
      });
    }
    console.log("Data Base is connected... ");
  })
  .catch(err => console.log(err));

const store = new mongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  autoRemove: true
});

app.set('trust proxy', 1); // Required for secure cookies on Vercel/proxies

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Set to `true` in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
  }
}));

const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const paymentRoutes = require('./routes/payment');
const BloodBankUserRoutes = require('./blood_bank/routes/userRoutes');
const BloodBankRoutes = require('./blood_bank/routes/bankRoute');
const BloodCampRoutes = require('./blood_bank/routes/bloodCamp');
const BlogRoutes = require('./Blogs/routes/BlogRoutes');
const AdminRoutes = require('./routes/adminRoutes');

app.use('/api/patient', patientRoutes);

app.use('/api/doctor', doctorRoutes);

app.use('/api/payment', paymentRoutes);

app.use('/api/blood-bank', BloodBankRoutes);

app.use('/api/blood-bank-user', BloodBankUserRoutes);

app.use('/api/blood-camp', BloodCampRoutes);

app.use('/api/blogs', BlogRoutes);

app.use('/api/admin', AdminRoutes);

app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log(req.user);
  next();
});

// Serving static files
const os = require('os');
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
if (isVercel) {
  app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));
} else {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

const auth = require('./middleware/auth');

// app.get('/api/stream/token', (req, res) => {
//for this code we have to update the session withuserId for both patientId and doctorId due to this I am considering the second code snippet
//     try {
//         if(req.session.userId){
//             console.log("Generating Stream token for user:", req.user);
//             if (!req.user || !req.user._id) {
//                 console.error("User not authenticated or user ID not found");
//                 return res.status(401).json({ error: "Unauthorized - User not authenticated" });
//             }
//             const userId=req.user._id.toString();
//             console.log("Generating Stream token for user:", req.user);
//             const token = streamClient.createToken(userId);
//             res.json({ token});
//             console.log("Stream token generated for user:", token);
//         }    
//         else{
//             console.log("User not authenticated");
//             res.status(401).json({ error: "Unauthorized - User not authenticated" });
//         }
//     } catch (error) {
//         console.error("Error generating Stream token:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }

// })
const Doctor = require('./models/doctor')
const Patient = require('./models/patient');   // adjust path as needed

app.get('/api/me', async (req, res) => {
  try {
    console.log("Inside /me route");
    // console.log("Session:", req.session);

    if (req.session.doctorId) {
      const doctor = await Doctor.findById(req.session.doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      return res.json({
        role: "doctor",
        userId: doctor._id.toString(),
        name: doctor.fullname || doctor.name || "Doctor",
      });
    }

    if (req.session.patientId) {
      const patient = await Patient.findById(req.session.patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      console.log("Patient found:", patient);
      return res.json({
        role: "patient",
        userId: patient._id.toString(),
        name: patient.fullname || patient.name || "Patient",
      });
    }
    console.log("No session found for doctor or patient");

    return res.status(401).json({ message: "Not logged in as doctor or patient" });

  } catch (error) {
    console.error("Error in /me route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Legacy Redirect: If someone clicks an old /api/video-call link from chat, redirect to frontend
app.get('/api/video-call/:id', (req, res) => {
  res.redirect(`/video-call/${req.params.id}`);
});


const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const streamClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

app.get('/api/stream/token', async (req, res) => {
  try {
    const userId = req.session.doctorId || req.session.patientId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const token = streamClient.createToken(userId.toString());
    return res.json({ token, userId: userId.toString(), apiKey: streamApiKey });
  } catch (err) {
    console.error("Stream Token Generation Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.post('/api/stream/upsert-users', async (req, res) => {
  try {
    let { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Users array is required' });
    }

    // ✅ Debug logging
    console.log("Upserting users:", users);

    // 👇 This will throw if any `user.id` is falsy
    const formattedUsers = users.map(user => {

      console.log("Processing user:", user.id);
      if (!user || !user.id) throw new Error("User object missing `id`");
      return {
        id: user.id.toString(), // ensure it's a string
      };
    });

    await streamClient.upsertUsers(formattedUsers);

    return res.status(200).json({ message: 'Users upserted successfully' });
  } catch (err) {
    console.error('Upsert Error:', err);
    return res.status(500).json({ error: 'Failed to upsert users', details: err.message });
  }
});

module.exports = app;
