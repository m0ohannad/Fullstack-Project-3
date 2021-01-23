// في هذا الملف ، قم بإعداد وحدة المستخدم (المدرس) الخاصة بك | in this file, set up your user module

// 1. قم باستيراد مكتبة moongoose | import the mongoose library
import {Schema, model} from "mongoose";
import {hashPassword} from "../helper";
import { nanoid } from 'nanoid';

// 2. قم بتحديد مخطط المدرس | start defining your user schema
const TeacherSchema = new Schema({
    name: String,
    birthdate: String,
    city: String,
    email: {type: String, unique: true},
    password: String,
    salt: String
})

// 3. إنشاء نموذج المدرس | create  the user model

// تخزين كلمة السر بعد عمل الهاش
TeacherSchema.pre('save', function(next) {
    if(!this.salt){
        this.salt = nanoid();
    }
    
    if(this.password){
        this.password = hashPassword(this.password, this.salt)
    }
    
    next();
});
const TeacherModel = new model('Teacher', TeacherSchema);

// 4. تصدير الوحدة | export the module
export default TeacherModel;