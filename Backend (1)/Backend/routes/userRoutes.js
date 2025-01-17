import express from "express";
import { bookAppointment, getProfile, loginUser, registerUser, updateProfile, listAppointments,cancelAppointment ,forgotPassword,resetPassword} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointments); 
userRouter.post('/cancel-appointment',authUser,cancelAppointment);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);


export default userRouter;
