const express = require("express");
const router = express.Router();

const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getClasses,
  getClass,
  createClasses,
  updateClasses,
  deleteClasses,
} = require("../controllers/students");

router.route("/").get(getStudents).post(createStudent);

router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

router.route("/:id/classes").get(getClasses).post(createClasses).put(updateClasses).delete(deleteClasses);

router.route("/:id/classes/:className").get(getClass);

module.exports = router;
