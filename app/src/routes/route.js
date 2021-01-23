// في هذا الملف ، قم بإعداد طرق التطبيق الخاصة بك | in this file, set up your application routes
import jwt from "jsonwebtoken";
import * as joi from "joi";
import {hashPassword} from "../helper";

// 1. استيراد وحدةالمدرس | import the teacher module
import TeacherModel from "../models/Teacher";

// 2. استيراد وحدة الطالب | import the student module
import StudentModel from "../models/Student";

const setupRoutes = (app) => {
    // 3. تسجيل مدرس جديد و تخزين بياناته | new teacher sign up
    app.post('/teacher/register', async (req, res) => {

        const {name, birthdate, city, email, password} = req.body;
        const bodySchhema = joi.object({
            name: joi.string().required(),
            birthdate: joi.string().required(),
            city: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().min(6).required()
        })

        const validationResult = bodySchhema.validate(req.body);
        if(validationResult.error){
            res.statusCode = 400;
            res.send(validationResult.error.details[0].message);

            return
        }
        try {
            const newTeacher = new TeacherModel({
                name,
                birthdate,
                city,
                email,
                password
            })
            
            await newTeacher.save();
    
            res.send(newTeacher);

        } catch (error) {
            res.statusCode = 400;
            res.send(error.message);
        }

    })

    // 4. تسجيل دخول مدرس و ارجاع التوكن | teacher login and response with jwt token
    app.post('/teacher/login', async (req, res) =>{
        const {email, password} = req.body;

        const user = await TeacherModel.findOne({email});

        if(!user){
            res.statusCode = 401;
            res.send('No Teacher found')
        }else{
            if(user.password === hashPassword(password, user.salt)){
                const token = jwt.sign({sub: user._id}, user.salt, {expiresIn: 60})
                res.send(token)
            }else{
                res.statusCode = 401; // 401 or 403
                res.send('Password is wrong!')
            }
        }
    })
    
    // 5. إعداد طرق مختلفة | setup the different routes (get, post, put, delete)
    app.get('/students', checkToken(), async (req, res) => {

        if(req.query.id){
            const student = await StudentModel.findById(req.query.id)
            if(!student){
                res.statusCode = 404;
                res.send('student with this ID does not exist!');
            }else res.send(student)
        }else{
            const students = await StudentModel.find({})
            res.send(students)
        }
    })

    app.post('/students/register', checkToken(), async (req, res) => {

        const {name, birthdate, city, email} = req.body;
        const bodySchhema = joi.object({
            name: joi.string().required(),
            birthdate: joi.string().required(),
            city: joi.string().required(),
            email: joi.string().email().required(),
        })

        const validationResult = bodySchhema.validate(req.body);
        if(validationResult.error){
            res.statusCode = 400;
            res.send(validationResult.error.details[0].message);

            return
        }
        try {
            const newStudent = new StudentModel({
                name,
                birthdate,
                city,
                email,
            })
            
            await newStudent.save();
    
            res.send(newStudent);

        } catch (error) {
            res.statusCode = 400;
            res.send(error.message);
            return
        }
        
    })

    app.put('/students/:id', checkToken(), async (req, res) => {

        const {id} = req.params;
        const student = await StudentModel.findById(id);

        if(!student){
            res.statusCode = 404; // 400 or 404
            res.send('student id is not correct!');
        }else{
            const {name, birthdate, city} = req.body;
    
            if(name) student.name = name;
            if(birthdate) student.birthdate = birthdate;
            if(city) student.city = city;
            student.save();
            res.send(student);
        }

    })

    app.delete('/students/:id', checkToken(), async (req, res) => {

        const {id} = req.params;
        const student = await StudentModel.findById(id);
        
        if(!student){
            res.statusCode = 404;
            res.send('student with this ID does not exist!');
        }else{
            student.delete();
            res.send(`student with ID = ${id} is deleted!`);
        }

    })
    
    app.get('*',  (req, res) => res.send('URL not found!'));
}

const checkToken = () =>{
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
    
            if(!token){
                res.statusCode = 401;
                res.send('You have no permissions!');
                return;
            }
    
            const decodedToken = jwt.decode(token);
    
            const teacher =  await TeacherModel.findById(decodedToken.sub);
    
            if(!teacher){
                res.statusCode = 401;
                res.send('You have no permissions!');
                return;
            }
            
            jwt.verify(token, teacher.salt);
            
        } catch (error) {
            res.statusCode = 401;
            res.send(error.message)
            return
        }
        next();
    }
}

// 3. تصدير الوحدة | export the module
export default setupRoutes;