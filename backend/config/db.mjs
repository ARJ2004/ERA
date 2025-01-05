import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://AJ01:6sCOxeOXhlzVanA1@era01.twkxr.mongodb.net/");
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    
  }
};
export default connectDB