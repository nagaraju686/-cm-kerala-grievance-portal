
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Department from "../models/Department.js";

dotenv.config();

const departments = [
  {
    name: "Revenue Department",
    description: "Land and revenue related complaints"
  },
  {
    name: "Police Department",
    description: "Public safety and police related complaints"
  },
  {
    name: "Health Department",
    description: "Hospitals and public health complaints"
  },
  {
    name: "Education Department",
    description: "Schools and education related complaints"
  },
  {
    name: "Water Resources Department",
    description: "Water supply and drainage complaints"
  },
  {
    name: "Electricity Department",
    description: "Electricity supply related complaints"
  },
  {
    name: "Local Self Government Department",
    description: "Roads, sanitation and local body complaints"
  },
  {
    name: "Transport Department",
    description: "Public transport and road transport complaints"
  }
];

const seedDepartments = async () => {
  try {
    await connectDB();

    for (const department of departments) {
      await Department.findOneAndUpdate(
        { name: department.name },
        department,
        { upsert: true, new: true }
      );
    }

    console.log("Demo Departments Created Successfully!");

    departments.forEach((department) => {
      console.log(department.name);
    });

    process.exit(0);

  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

seedDepartments();
