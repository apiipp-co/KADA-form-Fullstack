const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};


// Set Token Cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
  });
};



// =======================
// REGISTER USER
// =======================
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    // Cek user sudah ada
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Buat user baru
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });


    // Generate token
    const token = generateToken(user._id);


    // Simpan token cookie
    setTokenCookie(res, token);


    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });


  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};




// =======================
// LOGIN USER
// =======================
const login = async (req, res) => {
  try {

    const { email, password } = req.body;


    // Cari user berdasarkan email
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }


    // Cek password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );


    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }


    // Generate JWT
    const token = generateToken(user._id);


    // Simpan token cookie
    setTokenCookie(res, token);


    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });


  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};




// =======================
// LOGOUT USER
// =======================
const logout = (req, res) => {

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });


  res.status(200).json({
    message: "Logout successfully",
  });

};

//get current profile
// =======================
// GET CURRENT USER PROFILE
// =======================
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Export
module.exports = {
  register,
  login,
  logout,
  getMe,
};