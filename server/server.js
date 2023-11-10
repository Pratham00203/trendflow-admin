const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/db");
const auth = require("./middleware/auth");
const PORT = process.env.PORT || 8000;
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Report = require("./models/Report")

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth/", require("./routes/auth"));
app.use("/api/post/", require("./routes/post"));
app.use("/api/admin/", require("./routes/admin"));

app.get("/", (req, res) => {
  res.status(200).send("Server Running....");
});

app.get("/dashboard", auth, async (req, res) => {
  try {
    if (req.admin.role !== "admin") {
      return res.status(401).json({ error: "Not authorized" });
    }

    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalReports = await Report.countDocuments();

    return res.status(200).json({ totalUsers, totalPosts, totalComments, totalReports });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log("Server running"));
