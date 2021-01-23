"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _route = _interopRequireDefault(require("./routes/route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  استيراد المكتبات المطلوبة | import the required libraries
//  تأكد من تنزيل الوحدات المطلوبة | make sure to download the required modules
// لا تنسى تحديد وظيفة الخادم | don't forget to define the server function that listens to requests
const start = async () => {
  try {
    await _mongoose.default.connect('mongodb://localhost/school', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("Connected to DB, lets create an app");
    const app = (0, _express.default)();
    app.use(_bodyParser.default.urlencoded({
      extended: true
    }));
    console.log("App is created, lets setup routes");
    (0, _route.default)(app);
    console.log("App routes is added lets listen on 3000");
    app.listen(3000);
  } catch (error) {
    console.error(error);
  }
};

start();