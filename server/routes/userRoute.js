import express from 'express'
import {changeName, changePassword, forgotPassword, isAuth, login, logout, register, resetPassword} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/logout',authUser,logout)
userRouter.put('/change-pass',authUser,changePassword)

userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.put('/change-name', authUser, changeName)


export default userRouter;