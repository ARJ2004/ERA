import express from 'express';
import User from '../models/User.mjs';
import Room from '../models/Room.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, name, role, usn, class: studentClass, eid, phno } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password,
      name,
      role,
      usn,
      class: studentClass,
      eid,
      phno,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User Details
router.get('/details/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('allocatedRoom');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update User Details
router.put('/details/:id', async (req, res) => {
  const { name, email, phno, usn, class: studentClass, eid, allocatedRoom, seatNumber } = req.body;

  const updateFields = {
    name,
    email,
    ...(phno && { phno }),
    ...(usn && { usn }),
    ...(studentClass && { class: studentClass }),
    ...(eid && { eid }),
    ...(allocatedRoom && { allocatedRoom }),
    ...(seatNumber && { seatNumber }),
  };

  try {
    let user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select('-password').populate('allocatedRoom');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get All Users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('allocatedRoom');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Delete User
router.delete('/users/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      console.log(`Attempting to delete user with ID: ${userId}`); // Debugging log

      const result = await User.deleteOne({ _id: userId }); // Use deleteOne method to delete the user
      if (result.deletedCount === 0) {
          console.log(`User with ID ${userId} not found`); // Debugging log
          return res.status(404).json({ msg: 'User not found' });
      }

      console.log(`User with ID ${userId} deleted successfully`); // Debugging log
      res.json({ msg: 'User removed' });
  } catch (err) {
      console.error(`Error deleting user: ${err.message}`); // Detailed error log
      res.status(500).send('Server error');
  }
});





// Search User by Name
router.get('/search', async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ name: { $regex: name, $options: 'i' } }).select('-password').populate('allocatedRoom');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Search User by USN
router.get('/search/usn', async (req, res) => {
  const { usn } = req.query;
  try {
    const users = await User.find({ usn: { $regex: usn, $options: 'i' } }).select('-password').populate('allocatedRoom');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add Room
router.post('/rooms', async (req, res) => {
  const { roomNumber, building, floor, capacity, subject, exam, date, time, allocatedTo } = req.body;

  try {
    const room = new Room({
      roomNumber,
      building,
      floor,
      capacity,
      subject,
      exam,
      date,
      time,
      allocatedTo,
      allocatedSeats: [], // Initialize allocatedSeats array
    });

    await room.save();

    // Update the allocated user's room details
    await User.findByIdAndUpdate(allocatedTo, { allocatedRoom: room._id });

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get All Rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().populate('allocatedTo', 'name email');
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Room by Allocated User
router.get('/rooms/allocated/:userId', async (req, res) => {
  try {
    const room = await Room.findOne({ allocatedTo: req.params.userId }).populate('allocatedTo', 'name email');
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete Room
router.delete('/rooms/:id', async (req, res) => {
  try {
      const room = await Room.findById(req.params.id);
      if (!room) {
          return res.status(404).json({ msg: 'Room not found' });
      }
      // Update the allocated user's room details to null
      await User.findByIdAndUpdate(room.allocatedTo, { allocatedRoom: null });
      await Room.deleteOne({ _id: req.params.id }); // Use deleteOne method to delete the room
      res.json({ msg: 'Room removed' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});



// Fetch Room Occupancy
router.get('/rooms/:roomId/occupancy', async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    const occupancy = room.allocatedSeats ? room.allocatedSeats.length : 0;
    res.status(200).json({ occupancy });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to fetch room occupancy');
  }
});

// Allocate Room and Seat
router.put('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { allocatedTo, seatNumber } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    if (room.allocatedSeats && room.allocatedSeats.length >= room.capacity) {
      return res.status(400).json({ msg: 'Room is at full capacity' });
    }

    room.allocatedSeats.push(seatNumber);
    room.allocatedTo = allocatedTo;
    await room.save();

    // Update the user's details with the allocated room and seat number
    await User.findByIdAndUpdate(allocatedTo, { allocatedRoom: roomId, seatNumber });

    res.status(200).send('Room and seat allocated successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to allocate room and seat');
  }
});

export default router;
