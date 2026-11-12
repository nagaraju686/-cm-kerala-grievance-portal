
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/user.js";

dotenv.config();

const createDemoUsers = async () => {
  try {
    await connectDB();

    // CMO ADMIN ACCOUNT
    const cmoPassword = await bcrypt.hash("CMO@12345", 10);

    await User.findOneAndUpdate(
      { email: "cmo@cmkerala.demo" },
      {
        name: "CMO Administrator",
        email: "cmo@cmkerala.demo",
        mobile: "9000000001",
        password: cmoPassword,
        role: "cmo"
      },
      { upsert: true, new: true, runValidators: true }
    );

    // OFFICER ACCOUNT
    const officerPassword = await bcrypt.hash("Officer@12345", 10);

    await User.findOneAndUpdate(
      { email: "officer@cmkerala.demo" },
      {
        name: "Demo Officer",
        email: "officer@cmkerala.demo",
        mobile: "9000000002",
        password: officerPassword,
        role: "officer"
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("Demo accounts created successfully!");

    console.log("CMO Email: cmo@cmkerala.demo");
    console.log("CMO Password: CMO@12345");

    console.log("Officer Email: officer@cmkerala.demo");
    console.log("Officer Password: Officer@12345");

    process.exit(0);

  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

createDemoUsers();
