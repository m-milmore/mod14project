const Student = require("../models/Student");
const url = require("url");
const { orderBy, startCase, toLower } = require("lodash");

// @desc		Get all students
// @route		GET /api/v1/students
// @access	PUBLIC
exports.getStudents = async (req, res, next) => {
  try {
    let students = await Student.find();
    const queryParams = url.parse(req.url, true).query; // http://localhost:5001/api/v1/students?sort=desc&limit=2
    if ("sort" in queryParams) {
      const sortOrder = queryParams.sort || "asc";
      students = orderBy(students, ["lastName"], [sortOrder]);
    }
    if ("limit" in queryParams) {
      students = students.slice(0, queryParams.limit);
    }
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Get single student
// @route		GET /api/v1/students/:id
// @access	PUBLIC
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Create new student
// @route		POST /api/v1/students
// @access	PRIVATE
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Update student
// @route		PUT /api/v1/students/:id
// @access	PRIVATE
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Delete student
// @route		DELETE /api/v1/students/:id
// @access	PRIVATE
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// STUDENT CLASSES

// @desc		Get single student all classes
// @route		GET /api/v1/students/:id/classes
// @access	PUBLIC
exports.getClasses = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    res.status(200).json({ success: true, data: student.classes });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Get single student single class
// @route		GET /api/v1/students/:id/classes/:className
// @access	PUBLIC
exports.getClass = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    if (req.params.className) {
      const queryClass = startCase(toLower(req.params.className));
      if (student.classes.includes(queryClass)) {
        res.status(200).json({ success: true, data: queryClass });
      } else {
        res
          .status(200)
          .json({ success: true, message: `Class ${queryClass} not found` });
      }
    } else {
      res.status(400).json({ success: false, message: "Bad Request" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Post single student new classes
// @route		POST /api/v1/students/:id/classes
// @access	PRIVATE
exports.createClasses = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    if (req.body.classes) {
      let newClasses = [
        ...student.classes,
        ...req.body.classes.map((className) => startCase(toLower(className))),
      ];
      newClasses = [...new Set(newClasses)];
      const updates = {
        classes: newClasses,
        updatedOn: new Date(),
      };
      student = await Student.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
    }
    res.status(201).json({ success: true, data: student.classes });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Update single student classes
// @route		PUT /api/v1/students/:id/classes
// @access	PRIVATE
exports.updateClasses = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    let updatedClasses = [];
    // if there are some classes to be removed
    if (req.body.remove) {
      updatedClasses = student.classes.filter(
        (item) => !req.body.remove.includes(item)
      );
    } else {
      updatedClasses = student.classes;
    }
    // if there are some classes to add
    if (req.body.replace) {
      updatedClasses = [
        ...updatedClasses,
        ...req.body.replace.map((className) => startCase(toLower(className))),
      ];
    }
    // eliminate duplicates
    updatedClasses = [...new Set(updatedClasses)];
    const updates = {
      classes: [...updatedClasses],
      updatedOn: new Date(),
    };
    student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: student.classes });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};

// @desc		Get single student delete all classes (and replace them with supplied req.body if provided)
// @route		DELETE /api/v1/students/:id/classes
// @access	PRIVATE
exports.deleteClasses = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }
    let newClasses = req.body.classes
      ? req.body.classes.map((item) => startCase(toLower(item)))
      : [];
    newClasses = [...new Set(newClasses)];
    const updates = {
      classes: newClasses,
      updatedOn: new Date(),
    };
    student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: student.classes });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in catch" });
  }
};
