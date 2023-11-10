const router = require("express").Router();
const auth = require("../middleware/auth");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// @route    GET api/auth/
// @desc     Get Current Admin details
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(400).json({ error: "Your account not found" });
    }
    return res.status(200).json({ admin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    POST api/auth/login
// @desc     Login admin
// @access   Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ error: "Admin account not found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Generate and return token
    const payload = {
      admin: {
        id: admin.id,
        role: "admin",
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    POST api/auth/register
// @desc     Register a admin
// @access   Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ error: "Admin account already exists" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();

    // Generate and return token
    const payload = {
      admin: {
        id: admin.id,
        role: "admin",
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
