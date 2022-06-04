import asyncHandler from "express-async-handler";
import User from '../Models/userModel.js'
import generateToken from '../utils/generateToken.js'

const getUserProfile = asyncHandler(async (req, res) => {
  // console.log(req.body)
  // console.log(req.user)
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wallet:user.wallet,
      refferalId:user.reffId,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})



// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    })

  if (user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      referralId: user.reffId,
      wallet:user.wallet
     })
  }else{
    res.status(400);
    throw new Error('Invalid user data');
  }

})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin



// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  // console.log(req.body)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
    // console.log(user)
    // console.log(updatedUser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


export { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, updateUser,getUserById,getUsersReport} 