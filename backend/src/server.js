const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/authRoutes"));
// Mount scheme routes
app.use("/api/schemes", require("./routes/schemeRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
