"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _helper = require("../helper");

var _nanoid = require("nanoid");

// في هذا الملف ، قم بإعداد وحدة المستخدم (المدرس) الخاصة بك | in this file, set up your user module
// 1. قم باستيراد مكتبة moongoose | import the mongoose library
// 2. قم بتحديد مخطط المدرس | start defining your user schema
const TeacherSchema = new _mongoose.Schema({
  name: String,
  birthdate: String,
  city: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  salt: String
}); // 3. إنشاء نموذج المدرس | create  the user model
// تخزين كلمة السر بعد عمل الهاش

TeacherSchema.pre('save', function (next) {
  if (!this.salt) {
    this.salt = (0, _nanoid.nanoid)();
  }

  if (this.password) {
    this.password = (0, _helper.hashPassword)(this.password, this.salt);
  }

  next();
});
const TeacherModel = new _mongoose.model('Teacher', TeacherSchema); // 4. تصدير الوحدة | export the module

var _default = TeacherModel;
exports.default = _default;