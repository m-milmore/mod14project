const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name for this new student"],
    trim: true,
    maxLength: [15, "Student first names have an upper limit of 15 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name for this new student"],
    trim: true,
    maxLength: [15, "Student last names have an upper limit of 15 characters"],
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  updatedOn: {
    type: Date,
    default: Date.now(),
  },
  grade: {
    type: Number,
    min: [0, "Minimum grade is 0"],
    max: [100, "Maximum grade is 100"],
    required: [true, "Please give this new student a grade"],
  },
  classes: {
    type: [String],
  },
});

module.exports = mongoose.model("Student", StudentSchema);
