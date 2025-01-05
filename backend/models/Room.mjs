import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: String, required: true },
  capacity: { type: Number, required: true },
  subject: { type: String, required: true },
  exam: { type: String, required: true },
  date: { type: String, required: true }, // Format: DD/MM/YYYY
  time: { type: String, required: true }, // Format: HH:MM-HH:MM
  allocatedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of allocated users
  allocatedSeats: [ Number ], // Array of seat numbers
});

// Ensure unique combination of roomNumber, date, and time
RoomSchema.index({ roomNumber: 1, date: 1, time: 1 }, { unique: true });

// Validation Middleware
RoomSchema.pre('save', async function (next) {
  try {
    const existingRoom = await mongoose.models.Room.findOne({
      roomNumber: this.roomNumber,
      date: this.date,
      time: this.time,
    });

    if (existingRoom && existingRoom._id.toString() !== this._id.toString()) {
      const error = new Error(
        `Room ${this.roomNumber} is already booked on ${this.date} during ${this.time}.`
      );
      next(error);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;
