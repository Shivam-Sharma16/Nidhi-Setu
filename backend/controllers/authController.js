import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const register = async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    address, 
    aadharNumber, 
    phoneNumber, 
    dateOfBirth, 
    gender 
  } = req.body;
  
  try {
    // Check if user already exists with email or Aadhar number
    let user = await User.findOne({ 
      $or: [{ email }, { aadharNumber }] 
    });
    
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      if (user.aadharNumber === aadharNumber) {
        return res.status(400).json({ message: "User with this Aadhar number already exists" });
      }
    }
    
    // Validate required fields
    if (!name || !email || !password || !address || !aadharNumber || !phoneNumber || !dateOfBirth || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Validate address object
    if (!address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ message: "Complete address information is required" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      aadharNumber,
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender
    });
    
    await user.save();
    
    const payload = {
      user: {
        id: user._id,
      },
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",  
    });
    res.status(200).json({
      token,
    });
    } catch (error) {  
        res.status(500).json({ message: "Server error" }); 
    }
};
export const logout = (req, res) => {
  // Invalidate the token on the client side
  res.status(200).json({ message: "Logged out successfully. Please remove the token on the client side " });
};
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        aadharNumber: user.aadharNumber,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const viewusers = async (req, res) => {
  try {
    const users = await User.find({}); 
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

