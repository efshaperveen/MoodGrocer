const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // .env file ko load karta hai
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")


connectDB();
// MongoDB connect karna

const app = express();
// Express app create

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL
}));
// app.use(cors(
// ));


// MOUNT ROUTES
app.use("/api/users", userRoutes);
// All user related routes start with /api/users

app.use("/api/plans", planRoutes);
// All weekly plan routes start with /api/plans

app.use("/api/dashboard", dashboardRoutes);


app.use(errorHandler);

// SERVER LISTEN
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});