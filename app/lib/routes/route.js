"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var joi = _interopRequireWildcard(require("joi"));

var _helper = require("../helper");

var _Teacher = _interopRequireDefault(require("../models/Teacher"));

var _Student = _interopRequireDefault(require("../models/Student"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// في هذا الملف ، قم بإعداد طرق التطبيق الخاصة بك | in this file, set up your application routes
// 1. استيراد وحدةالمدرس | import the teacher module
// 2. استيراد وحدة الطالب | import the student module
const setupRoutes = app => {
  // 3. تسجيل مدرس جديد و تخزين بياناته | new teacher sign up
  app.post('/teacher/register', async (req, res) => {
    const {
      name,
      birthdate,
      city,
      email,
      password
    } = req.body;
    const bodySchhema = joi.object({
      name: joi.string().required(),
      birthdate: joi.string().required(),
      city: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    });
    const validationResult = bodySchhema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }

    try {
      const newTeacher = new _Teacher.default({
        name,
        birthdate,
        city,
        email,
        password
      });
      await newTeacher.save();
      res.send(newTeacher);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  }); // 4. تسجيل دخول مدرس و ارجاع التوكن | teacher login and response with jwt token

  app.post('/teacher/login', async (req, res) => {
    const {
      email,
      password
    } = req.body;
    const user = await _Teacher.default.findOne({
      email
    });

    if (!user) {
      res.statusCode = 401;
      res.send('No Teacher found');
    } else {
      if (user.password === (0, _helper.hashPassword)(password, user.salt)) {
        const token = _jsonwebtoken.default.sign({
          sub: user._id
        }, user.salt, {
          expiresIn: 60
        });

        res.send(token);
      } else {
        res.statusCode = 401; // 401 or 403

        res.send('Password is wrong!');
      }
    }
  }); // 5. إعداد طرق مختلفة | setup the different routes (get, post, put, delete)

  app.get('/students', checkToken(), async (req, res) => {
    // try {
    //     const token = req.headers.authorization;
    //     if(!token){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     const decodedToken = jwt.decode(token);
    //     const teacher =  await TeacherModel.findById(decodedToken.sub);
    //     if(!teacher){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     jwt.verify(token, teacher.salt);
    // } catch (error) {
    //     res.statusCode = 401;
    //     res.send(error.message)
    //     return
    // }
    if (req.query.id) {
      const student = await _Student.default.findById(req.query.id);

      if (!student) {
        res.statusCode = 404;
        res.send('student with this ID does not exist!');
      } else res.send(student);
    } else {
      const students = await _Student.default.find({});
      res.send(students);
    }
  });
  app.post('/students/register', checkToken(), async (req, res) => {
    // try {
    //     const token = req.headers.authorization;
    //     if(!token){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     const decodedToken = jwt.decode(token);
    //     const teacher =  await TeacherModel.findById(decodedToken.sub);
    //     if(!teacher){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     jwt.verify(token, teacher.salt);
    // } catch (error) {
    //     res.statusCode = 401;
    //     res.send(error.message)
    //     return
    // }
    const {
      name,
      birthdate,
      city,
      email
    } = req.body;
    const bodySchhema = joi.object({
      name: joi.string().required(),
      birthdate: joi.string().required(),
      city: joi.string().required(),
      email: joi.string().email().required()
    });
    const validationResult = bodySchhema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }

    try {
      const newStudent = new _Student.default({
        name,
        birthdate,
        city,
        email
      });
      await newStudent.save();
      res.send(newStudent);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
      return;
    }
  });
  app.put('/students/:id', checkToken(), async (req, res) => {
    // try {
    //     const token = req.headers.authorization;
    //     if(!token){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     const decodedToken = jwt.decode(token);
    //     const teacher =  await TeacherModel.findById(decodedToken.sub);
    //     if(!teacher){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     jwt.verify(token, teacher.salt);
    // } catch (error) {
    //     res.statusCode = 401;
    //     res.send(error.message)
    //     return
    // }
    const {
      id
    } = req.params;
    const student = await _Student.default.findById(id);

    if (!student) {
      res.statusCode = 404; // 400 or 404

      res.send('student id is not correct!');
    } else {
      const {
        name,
        birthdate,
        city
      } = req.body;
      if (name) student.name = name;
      if (birthdate) student.birthdate = birthdate;
      if (city) student.city = city;
      student.save();
      res.send(student);
    }
  });
  app.delete('/students/:id', checkToken(), async (req, res) => {
    // try {
    //     const token = req.headers.authorization;
    //     if(!token){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     const decodedToken = jwt.decode(token);
    //     const teacher =  await TeacherModel.findById(decodedToken.sub);
    //     if(!teacher){
    //         res.statusCode = 401;
    //         res.send('You have no permissions!');
    //         return;
    //     }
    //     jwt.verify(token, teacher.salt);
    // } catch (error) {
    //     res.statusCode = 401;
    //     res.send(error.message)
    //     return
    // }
    const {
      id
    } = req.params;
    const student = await _Student.default.findById(id);

    if (!student) {
      res.statusCode = 404;
      res.send('student with this ID does not exist!');
    } else {
      student.delete();
      res.send("student with ID = ".concat(id, " is deleted!"));
    }
  });
  app.get('*', (req, res) => res.send('URL not found!'));
};

const checkToken = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.statusCode = 401;
        res.send('You have no permissions!');
        return;
      }

      const decodedToken = _jsonwebtoken.default.decode(token);

      const teacher = await _Teacher.default.findById(decodedToken.sub);

      if (!teacher) {
        res.statusCode = 401;
        res.send('You have no permissions!');
        return;
      }

      _jsonwebtoken.default.verify(token, teacher.salt);
    } catch (error) {
      res.statusCode = 401;
      res.send(error.message);
      return;
    }

    next();
  };
}; // 3. تصدير الوحدة | export the module


var _default = setupRoutes;
exports.default = _default;