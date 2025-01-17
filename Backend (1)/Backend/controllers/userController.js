import validator from 'validator';


import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js'
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//* Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details!' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashPassword };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//* Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//* Get User Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select('-password');
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//* Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, dob, address, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !address || !gender) {
      return res.json({ success: false, message: 'Missing details!' });
    }

    const updatedData = {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    };

    // Update basic user info
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

    // If image is provided, upload it to Cloudinary and update the user's profile image
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      const imageUrl = imageUpload.secure_url;
      updatedUser.image = imageUrl;
      await updatedUser.save();
    }

    res.json({ success: true, message: 'Profile updated successfully', updatedUser });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//* Book Appointment
//* Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, userId, slotDate, slotTime } = req.body;

    // Fetch doctor data
    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }

    // Initialize slots_booked if undefined
    let slotsBooked = docData.slots_booked || {};

    // Check if the slotDate exists in slots_booked and update it
    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }

    // Check if the slotTime is already booked
    if (slotsBooked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: 'Slot not available' });
    }

    // Add the slotTime to the booked slots
    slotsBooked[slotDate].push(slotTime);

    // Fetch user data
    const userData = await userModel.findById(userId).select('-password');
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Create appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: new Date(),
    };

    // Save appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update doctor's booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.json({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error' });
  }
};


const listAppointments = async (req, res) => {
    try {
      // Get userId from the authenticated request
      const { userId } = req.body;  // No need to use req.body for userId
  
      // Find all appointments for this user
      const appointments = await appointmentModel.find({ userId });
  
      // Check if appointments exist
      if (!appointments || appointments.length === 0) {
        return res.json({ success: false, message: 'No appointments found' });
      }
  
      // Return appointments if found
      res.json({ success: true, appointments });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: 'An error occurred while fetching appointments' });
    }
  };


  //Api to cancel appointment
  const cancelAppointment=async(req,res)=>{
    try {
      const {userId,appointmentId}=req.body
      const appointmentData=await appointmentModel.findById(appointmentId)
      // 
      if(appointmentData.userId !==userId){
        return res.json({sucess:false,message:"Unauthorized action"})
      }
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      // releasein g docotro slot
      const{docId,slotDate,slotTime}=appointmentData
      const doctorData=await doctorModel.findById(docId)
      let slots_booked=doctorData.slots_booked
      slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
      await doctorModel.findByIdAndUpdate(docId,{slots_booked})
      res.json({success:true,message:"appointment cancle"});

      
    } catch (error) {
      
    }
  }
  

//forget password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Create a password reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send the reset link to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `To reset your password, please click the following link: ${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ success: false, message: 'Error sending email' });
      }
      res.json({ success: true, message: 'Password reset link sent' });
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.json({ success: false, message: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    await userModel.findByIdAndUpdate(decoded.id, { password: hashPassword });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error' });
  }
};









export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments,cancelAppointment,forgotPassword,resetPassword };
