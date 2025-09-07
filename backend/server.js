import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/storyRoutes.js";

dotenv.config();
const app = express();

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/stories", routes);

app.get("/", (req, res) => {
    res.send("Story Generator API is running");
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));