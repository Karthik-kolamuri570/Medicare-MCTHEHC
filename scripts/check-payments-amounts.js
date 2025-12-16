/* Short script to inspect amount-related fields on recent paid appointments
   Usage: node scripts/check-payments-amounts.js
   Ensure MONGO_URI is present in your environment or .env (the backend runs with it already).
*/
const mongoose = require('mongoose');
const Appointment = require('../backend/models/appointments');
const Doctor = require('../backend/models/doctor');

require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });

async function main() {
  const uri = process.env.MONGO_URI || process.env.DB_URI || process.env.MONGO_URL;
  if (!uri) {
    console.error('MONGO_URI not set in env. Set it or run from backend environment.');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  // Find recent appointments with paymentStatus set
  const docs = await Appointment.find({ paymentStatus: { $exists: true } }).sort({ _id: -1 }).limit(50).populate('doctorId', 'name feePerConsultation');

  console.log(`Fetched ${docs.length} appointments (paymentStatus exists). Sample:
`);

  docs.forEach(d => {
    const amount = d.fee || d.price || (d.doctorId && d.doctorId.feePerConsultation) || 0;
    console.log(`ID: ${d._id}
  paymentId: ${d.paymentId}
  paymentStatus: ${d.paymentStatus}
  price: ${d.price}
  fee: ${d.fee}
  doctorFee: ${d.doctorId ? d.doctorId.feePerConsultation : 'N/A'}
  computed amount: ${amount}
  date: ${d.date}
`);
  });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});