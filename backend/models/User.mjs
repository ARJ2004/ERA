import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'invigilator', 'admin'], default: 'student' },
  usn: { type: String, unique: true, sparse: true }, // For students
  class: { type: String, sparse: true }, // For students
  eid: { type: String, unique: true, sparse: true }, // For invigilators
  phno: { type: String, sparse: true }, // For invigilators
  allocatedRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', sparse: true }, // Room the user is allocated to
  seatNumber: { type: Number, sparse: true }, // Seat number allocated to the user (only for students)
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
