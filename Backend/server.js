const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);