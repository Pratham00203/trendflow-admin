const router = require("express").Router();
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");

// @route    GET api/admin/all
// @desc     Get all admins
// @access   Private
router.get("/all", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    const admins = await Admin.find({}, { password: 0 });
    return res.status(200).json({ admins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/admin/delete/:adminid
// @desc     Delete a admin account
// @access   Private
router.delete("/delete/:adminid", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    await Admin.findByIdAndDelete(req.params.adminid);

    return res.status(200).json({ msg: "Account deleted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/admin/update/me
// @desc     Update a admin account
// @access   Private
router.put("/update/me", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { username, email } = req.body;

    await Admin.findByIdAndUpdate(req.admin.id, {
      username: username,
      email: email,
    });

    return res.status(200).json({ msg: "Account updated!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
