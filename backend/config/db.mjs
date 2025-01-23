import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect("YOUR_MONGOOSE_URL");
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    
  }
};
export default connectDB
