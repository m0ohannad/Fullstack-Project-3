"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

// في هذا الملف ، قم بإعداد وحدة المستخدم (الطالب) الخاصة بك | in this file, set up your user module
// 1. قم باستيراد مكتبة moongoose | import the mongoose library
// 2. قم بتحديد مخطط الطالب | start defining your user schema
const StudentSchema = new _mongoose.Schema({
  name: String,
  birthdate: String,
  city: String,
  email: {
    type: String,
    unique: true
  }
}); // 3. إنشاء نموذج الطالب | create  the user model

const StudentModel = new _mongoose.model('Student', StudentSchema); // 4. تصدير الوحدة | export the module

var _default = StudentModel;
exports.default = _default;