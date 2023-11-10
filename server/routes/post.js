const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const Comment = require('../models/Comment')

// @route    GET api/post/reports/all
// @desc     Get all reported posts
// @access   Private
router.get("/reports/all", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    const reports = await Report.find();
    return res.status(200).json({ reports });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/post/get/:postid
// @desc     Get a reported post
// @access   Private
router.get("/get/:reportid", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    const report = await Report.findById(req.params.reportid)
    const postId = new mongoose.Types.ObjectId(report.post_id);
    const reportDetails = await Report.aggregate([
      {
        $match: { post_id: postId },
      },
      {
        $lookup: {
          from: "posts",
          localField: "post_id",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: "$post",
      },
      {
        $lookup: {
          from: "users",
          localField: "post.user_id",
          foreignField: "_id",
          as: "postUser",
        },
      },
      {
        $unwind: "$postUser",
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "reportingUser",
        },
      },
      {
        $unwind: "$reportingUser",
      },
      {
        $project: {
          "postUser.password": 0, // exclude the password field
          "reportingUser.password": 0, // exclude the password field
        },
      },
    ]);

    return res.status(200).json({ reportDetails: reportDetails[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/post/delete/:reportid/:postid
// @desc     Delete a reported post
// @access   Private
router.delete("/delete/:reportid/:postid", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    await Report.findByIdAndDelete(req.params.reportid);
    await Comment.deleteMany({ post_id: req.params.postid });
    await Post.findByIdAndDelete(req.params.postid);

    return res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/post/report/:reportid/delete
// @desc     Delete a report
// @access   Private
router.delete("/report/:reportid/delete", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    await Report.findByIdAndDelete(req.params.reportid);

    return res.status(200).json({ msg: "Report deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
