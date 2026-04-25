const express = require('express');
const {
  register,
  login,
  getCurrentUser,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { username, email, password, firstName, lastName }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/me', authMiddleware, getCurrentUser);

router.post('.refresh-token',async(req,res) => {
  try{
    const {refreshToken}=req.body;
    if(!refreshToken){
      return res.status(401).json({
        success:false,
        message:'man refresh token kavaliga babu',

      });
    }
    //find user with this refresh token
    const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
    const user =await User.findById(decoded.id).select('+refreshToken');
    if(!user || user.refreshToken !== refreshtoken){
      return res.status(401).json({
        success:false,
        message:'babu refresh invalid ra saale',

      });
    }
    //check if token expired
    const token =generateToken(user._id,'1h');
    const newrefreshToken =generateToken(user._id,'7d',process.env.JWT_REFRESH_SECRET);
    user.refreshToken=newrefreshToken;
    await user.save();
    res.status(200).json({
      sucess:true,
      token,
      refreshToken:newrefreshToken,
    });

  }
   catch(error){
    res.status(401).json({
      success:false,
      message:'token refresdh failed babai',
      error:error.message,
    });
   }




});

module.exports = router;
