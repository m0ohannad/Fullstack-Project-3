//  استيراد المكتبات المطلوبة | import the required libraries
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//  تأكد من تنزيل الوحدات المطلوبة | make sure to download the required modules
import setupRoutes from "./routes/route";

// لا تنسى تحديد وظيفة الخادم | don't forget to define the server function that listens to requests
const start = async() => {
    try {
      await mongoose.connect('mongodb://localhost/school', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      console.log("Connected to DB, lets create an app");
      const app = express();
      app.use(bodyParser.urlencoded({extended: true}))
      console.log("App is created, lets setup routes");
      setupRoutes(app);
      console.log("App routes is added lets listen on 3000");
      app.listen(3000)
    } catch (error) {
      console.error(error) 
    }
  }
  
  start();