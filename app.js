const express= require("express");

const dotenv = require('dotenv'); // Import dotenv package

dotenv.config();

const app = express();


const port = process.env.PORT ||3000;
const path = require("path");
const socketio = require('socket.io')
const jwt = require("jsonwebtoken");
const Filter = require('bad-words');
const bycrpt = require("bcrypt");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//const authenticate = require("./dhdhd/bfbbyf.js");
const cookieParser = require('cookie-parser');
const session = require("express-session")
app.use(cookieParser());

const flash = require('connect-flash');
app.use(flash());
require("./src/db/connect.js")
/*app.listen(port,()=>{
    console.log("server run successfully")
})
*/

app. use(express.json());// for parsing 
app.use(express.urlencoded({extended:true}))//data by id aa jaye 
app.set("view engine","ejs");
const static_path = path.join(__dirname,"../views");//pura path dena hota hai 
app.use(express.static(static_path));
//const methodoverride = require("method-override"); // for put patch and delete method
//app.use(methodoverride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate)

app.use(express.static(path.join(__dirname,"../public")));


const mongodbsession = require("connect-mongodb-session")(session)

const bodyParser = require('body-parser');

const methodoverride = require("method-override"); // for put patch and delete method
app.use(methodoverride("_method"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const Student = require("./src/models/student.js")
const Doner = require("./src/models/doner.js");
const CLOUD = require("./src/models/cloudn.js");
const SinUp = require('./src/models/sinUp.js');
const Scholer = require('./src/models/scholer.js');
const EducationLoan = require('./src/models/educationLoan.js');
const Review = require('./src/models/review.js');







// Example usage
///////////////////////////############## Mongo Session################## //////////////////////////////////

const store = new mongodbsession({
 uri:'mongodb+srv://Dremers:ramramram@cluster0.sbirrhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
 collection:"mysessions",
})

app.use(session({
  secret:process.env.SECRET_KEY,
  resave:false,
  saveUninitialized:false,
  store:store,
  cookie: { maxAge: 6 * 60 * 60 * 1000 } // 6 hours session expiration
}))
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();

})

///////////////////////####### Authentication code ######//////////////////
// Middleware to check if user is authenticated and has the appropriate role
const isAuthenticatedstudent = (req, res, next) => {
  if (req.session.user) {
    // Check if user is authenticated
    const { role } = req.session.user;
    if (role === 'donor') {
      // If user is a donor, prevent access to the student page
      req.flash('error', 'Donors are not allowed to access student pages.');
      return res.redirect('/sinIn'); // Redirect to homepage or any other page
    }
    // User is authenticated and has the appropriate role, proceed to the next middleware
    next();
  } else {
    // User is not authenticated, redirect to login page with a flash message
    req.flash('error', 'Please login to access this page.');
    res.redirect('/sinIn');
  }
};
const isAuthenticateddonor = (req, res, next) => {
  if (req.session.user) {
    // Check if user is authenticated
    const { role } = req.session.user;
    if (role === 'donor') {
      // User is a donor, allow access to the page
      return next();
    } else {
      // User is not a donor, redirect to homepage with an error message
      req.flash('error', 'You are not authorized to access this page.');
      return res.redirect('/sinIn');
    }
  } else {
    // User is not authenticated, redirect to login page with a flash message
    req.flash('error', 'Please login to access this page.');
    return res.redirect('/sinIn');
  }
};
const isAuthenticatedAdmin = (req, res, next) => {
  if (req.session.admin) {
    // Check if user is authenticated
    const { role } = req.session.user;
    if (role === 'Admin') {
      // User is a donor, allow access to the page
      return next();
    } else {
      // User is not a donor, redirect to homepage with an error message
      req.flash('error', 'You are not authorized to access this page.');
      return res.redirect('/adminlogin');
    }
  } else {
    // User is not authenticated, redirect to login page with a flash message
    req.flash('error', 'Please login to access this page.');
    return res.redirect('/adminlogin');
  }
};
//////////////////////////######## Authentication code end ####////////////

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



// Configure Cloudinary
cloudinary.config({
  cloud_name:'drxgaesoh',
  api_key: '911397189256837',
  api_secret: '3u2KB4BndKIcxurUbB7hz9Lsy2s',
});

// Configure MongoDB connection

// Create a simple mongoose schema




// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads', // Cloudinary folder where you want to store files
    allowedFormats: ['jpg', 'png'],
});
const mongoose = require("mongoose");
const { AxiosHeaders } = require("axios");
const upload = multer({ storage: storage });//kha save krna h 
  

const uploadToCloudinary = async (file) => {
    if (file && file.path) {
      //const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } else {
      throw new Error('File buffer is undefined or null');
    }
  };



///////////////////////////##############  Authentication ################## //////////////////////////////////
let userEmail;





///////////////////////////##############  Get resquctes ################## //////////////////////////////////////////////////////////////////////
app.get('/sinin', (req, res) => {
  const flashMessages = req.flash();
  res.render('listings/sinin.ejs', { flashMessages });
});

app.get("/donorEdit/:id",async(req,res)=>{
    const{id} = req.params;
    const ddata = await Doner.findById(id)
    console.log(ddata)
 res.render("listings/doneredit.ejs",{ddata})
  
     })


app.get("/profile",async(req,res)=>{
  try{
const id = req.session.user.userId; 
if(req.session.user.Role=="donor"){
  const find  = await Doner.findById(id);
  res.render("listings/profiledoner.ejs",{find})

}else{
  const findd = await Student.findById(id);
res.send("hello")

  console.log(findd)
}
  }catch(err){
    console.log(err);
  }
})

app.get('/', async(req, res) => {    
 
  const donerId = '658d8a5f25bf4b855f346c1a';
//console.log(req.session.user.userId)
 const data = await Doner.find({}).limit(8);// yani desktop par 8 donor hi dikhane hai 
 const sdata = await Student.find({}).limit(4);

 const reviews = await Review.find();



      res.render('listings/index.ejs',{data,sdata,user: req.session.user,reviews});
   //   console.log(sdata)
    // res.send(data)
});


 app.get("/ramaa",(req,res)=>{
 
  
  res.render("listings/error.ejs")
 })

 app.get('/sinup', (req, res) => {
    console.log(req.flash('success')); // Log success flash messages
    console.log(req.flash('error')); // Log error flash messages
    res.render('listings/sinup.ejs', { messages: req.flash() });
     
    });





app.get("/donerdtail/:id",async(req,res)=>{
  try {
    const { id } = req.params;
    const raja = await Doner.findById(id);

    if (!raja) {
      // Handle the case when donor details are not found
      return res.status(404).json({ error: 'Donor details not found' });
    }

    console.log(raja);
    res.render("listings/raja.ejs",{ raja })
 
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})




app.get("/donerinput",(req,res)=>{
  const flashMessages = req.flash();
  res.render("listings/donerinput.ejs")
})
  
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error destroying session');
      } else {
        res.redirect("/");// pahle res.redrict("/l") tha
      }
    });
  });
  

  
  
  
   app.get("/student12th",(req,res)=>{
    const flashMessages = req.flash();
    res.render("listings/student12th.ejs")
   })
  
  

  
  app.get("/student-lons",async(req,res)=>{
  res.render("listings/help.ejs");

  
  })




app.get("/studentinformation/:id", async(req,res)=>{
    try {
      const { id } = req.params;
      const graja = await Student.findById(id);
  
      if (!graja) {
        // Handle the case when donor details are not found
        return res.status(404).json({ error: 'Donor details not found' });
      }
  
      console.log(graja);
      res.render("listings/stdinfo.ejs",{ graja })
   
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
  })
  
  
  
  app.get("/donerdtail/:id",async(req,res)=>{
    try {
      const { id } = req.params;
      const raja = await Doner.findById(id);
  
      if (!raja) {
        // Handle the case when donor details are not found
        return res.status(404).json({ error: 'Donor details not found' });
      }
  
      console.log(raja);
      res.render("listings/raja.ejs",{ raja })
   
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  

//////////////////////////##############  Post resquctes ################## //////////////////////////////////////////////////////////////////////





app.post("/newdoner", upload.fields([
  { name: 'Image', maxCount: 1 },

 
]), async(req,res)=>{
   const {Username,Fname,Lname,password,Email,Number,Descripition,countery,price,Image,For} = req.body;
   const IMAGE = await uploadToCloudinary(req.files['Image'][0]);
   console.log(Username,Fname,Lname,password,Email,Number,Descripition,countery,price,Image);


  

  const saltRounds = 10;
  const hashedPassword = await bycrpt.hash(password, saltRounds);

console.log(hashedPassword);



    const newdoner = await new Doner({
      Fname:Fname,
      Lname:Lname,
      Email:Email,
      username:Username,
      Number:Number,
      password:hashedPassword,
      Amount:price,
      Countery:countery,
      Descripition:Descripition,
     
      Image:IMAGE,
      For:For
     })
     console.log(newdoner);
const newdonerdata = await newdoner.save();

console.log(newdonerdata);

req.flash("success","New Donoer Registerd Successfully")
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  port:465,
  logger:true,
  debug:true,
  secure:true,
  secureConnection:false,

  auth: {
    user:'programming966051@gmail.com', // Your Gmail email address
    pass:'fdmp qqny iupt yfly',
  },
  tls:{
      rejectUnAuthorized:true,
  }
});

let mailOptions = {
  from:'programming966051@gmail.com', // Sender address
  to: Email, // List of receivers
  subject: ' Confirmation: Your Form Submission on Dreamers Platform', // Subject line
  html: ` <p>Dear ${Fname},</p>
  <p>Congratulations!</p>
  <p>We are pleased to inform you that your form has been successfully submitted on the Dreamers platform. Your registration as a donor signifies your commitment to making a positive impact in the lives of students in need.</p>
  <p>At Dreamers, we believe in the transformative power of education and the significant role that donors like you play in shaping the future of aspiring students. Your generosity has the potential to change someone's life and provide them with the opportunity to pursue their educational dreams.</p>
  <p>We are grateful for your decision to join our mission of fostering academic excellence and bridging the gap between ambition and opportunity. Your support is invaluable in creating a brighter future for deserving students and empowering them to achieve their goals.</p>
  <p>Thank you for registering with Dreamers. We appreciate your dedication to making a difference, and we look forward to working together to inspire hope and transform lives through education.</p>
  <p>If you have any questions or require further assistance, please do not hesitate to contact us at [your contact information].</p>
  <p>Once again, thank you for your generosity and commitment to our cause.</p>
  <p>Best regards,</p>
  <p>Harshit Sharma<br>
  Founder of Dremers <br>
  Dreamers Platform Team</p>
  ` // HTML formatted body
};
// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
  } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'Welcome! You have successfully signed up.');
      res.redirect('/')
  }
});
res.redirect("/") // pahle res.redrict("/l") tha


    })
 
 

app.put("/donereditdata/:id",async(req,res)=>{
  const{id}= req.params;
  const{Fname,Lname,Email,Number,username,Amount,Descripition,Countery} = req.body;

 const update = await Doner.findByIdAndUpdate(id,{

Fname:Fname,Lname,Email,Number,username,Amount,Descripition,Countery
  });
  const updateSave = await update.save();
  console.log(updateSave);
 
  res.redirect("/") // pahle res.redrict("/l") tha
});

app.delete("deletdta/:id",async (req,res)=>{
  const {id} = req.body;
  const deletedoner =  Doner.findByIdAndDelete(id);
  console.log(deletedoner);
  res.redirect("/");// pahle res.redrict("/l") tha
})

  
   
     app.post("/donerlogin",async(req,res)=>{
    let{Email,password,Username,Role} = req.body;
   
    const findDoner =  await Doner.findOne({Email})
    if(findDoner==null){
      req.flash("error", "Invalid credentials!"); 
      res.redirect("/login");
    }
    else{
    
      const hashpass = await bycrpt.compare(password, findDoner.password);
      console.log(hashpass);
      const token = await findDoner.generateAuthToken();
      console.log(token);
    
   //   const hashOTP = await bycrpt.compare(OTP, findDoner. Randomdigit);
    // console.log(hashOTP);
   
      if(  findDoner.Email===Email ){
        if(Role==="donor"){
          userEmail = Email;
          

          req.flash("success", "Welcome back! ");
          req.session.user = { Role , userId: findDoner._id};

console.log("hello hii name" + req.session.user.userId);
          res.redirect("/") // pahle res.redrict("/l") tha
        
        } 
       
        }
    }
     })
     

    
  
   
     app.post("/studentlogin",async(req,res)=>{
      let{Email,password,Username,Role} = req.body;
        
      const findStudent =  await Student.findOne({Email})
      if(findStudent==null){
        req.flash("error", "Invalid credentials!"); 
        res.redirect("/lostdnt");
      }
      else{
      
        const hashpass = await bycrpt.compare(password, findStudent.password);
        console.log(hashpass);
       // const token = await findDoner.generateAuthToken();
        //console.log(token);
      
     //   const hashOTP = await bycrpt.compare(OTP, findDoner. Randomdigit);
      // console.log(hashOTP);
     
        if( findStudent.Email===Email ){
          if(Role==="student"){
      

            req.flash("success", "Welcome to Dremers again!");
            req.session.user = { Role ,userId: findStudent._id };
            res.redirect("/")} } // pahle res.redrict("/l") tha
      }
       })
       
   





 let studentId; // Declare the variable in a higher-level scope

 app.post("/newstudent", async (req, res) => {
   try {
     let { Fname, Lname, gender, DOB, Email, Number, Descripition, Goal, city, HomeTown, password ,   SubCaste,
      Caste} = req.body;
     console.log(Fname, Lname, gender, DOB, Email, Number, Descripition, Goal, city, HomeTown, password,SubCaste,Caste);
 
     const data = new Student({
       Fname, Lname, gender, DOB, Email,Number, Descripition, Goal, city, HomeTown, password,Caste,SubCaste
     });
 
     // Save in the database
     const studentdata = await data.save();
     
     // Access the ID
     studentId = studentdata._id;
     console.log(studentId);

 
     res.render("listings/student12page2.ejs");
   } catch (error) {
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });
 
 // Access studentId outside the route handler or in another route

 
 // You can now access studentId in other parts of your code or routes
 
 app.post("/newstudentpage2", upload.fields([
  { name: 'Statement', maxCount: 1 },
  { name: 'ElectricCityBill', maxCount: 1 },
  { name: 'StudentImage', maxCount: 1 },
  { name: 'marksheet11th', maxCount: 1 },
  { name: 'marksheet10th', maxCount: 1 },
  { name: 'latter', maxCount: 1 },
]), async (req, res) => {
  try {
      const { FFname, FLname, FDOB, FEmail, FNumber, FAdhar, occupation, WName, WNumber, IFSC, tenth, evelenth, Accountno } = req.body;
      const Statement = await uploadToCloudinary(req.files['Statement'][0]);
      const marksheet10th = await uploadToCloudinary(req.files['marksheet10th'][0]);
      const StudentImage = await uploadToCloudinary(req.files['StudentImage'][0]);
      const marksheet11th = await uploadToCloudinary(req.files['marksheet11th'][0]);
      const Electricitybill = await uploadToCloudinary(req.files['ElectricCityBill'][0]);
      const latter = await uploadToCloudinary(req.files['latter'][0]);

      const Studnetfind = await Student.findByIdAndUpdate(studentId, {
          FFName: FFname,
          FLname: FLname,
          FDOB: FDOB,
          FEmail: FEmail,
          FNumber: FNumber,
          FAdhar: FAdhar,
          occupation: occupation,
          WName: WName,
          WNumber: WNumber,
          ElectricCityBill: Electricitybill,
          Statement: Statement,
          studentImage: StudentImage,
          tenth: tenth,
          evelenth: evelenth,
          marksheet10th,
          marksheet11th,
          IFSC,
          Accountno,
          latter,
      }, { new: true });

      console.log(Studnetfind)
      const student = Student.findById(studentId);
      const email = student.Email;
      req.flash("success", "New Student Registered");
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        port:465,
        logger:true,
        debug:true,
        secure:true,
        secureConnection:false,

        auth: {
          user:'dremersio@gmail.com', // Your Gmail email address
          pass:'fdmp qqny iupt yfly',
        },
        tls:{
            rejectUnAuthorized:true,
        }
    });

    let mailOptions = {
        from: 'dremersio@gmail.com', // Sender address
        to: email, // List of receivers
        subject: ' Congratulations! Your Form Submission on Dreamers Website', // Subject line
        html: `<p>Dear student, you have successfully registered on Dreamers.</p>
        <p>Dreamers is a unique platform dedicated to fostering the dreams of ambitious students who aspire for greater heights but are hindered by financial constraints. As a student, you have the opportunity to seek financial assistance to fuel your academic journey, while as a donor, you can make a meaningful difference by supporting deserving children in need.</p>
        <p>At Dreamers, we believe in the power of education to transform lives and communities. We provide a platform where students can turn their aspirations into reality, regardless of their financial circumstances. Our community of donors generously contributes to the academic endeavors of bright young minds, empowering them to pursue their dreams without limitations.</p>
        <p>Whether you are a student seeking support or a donor looking to make a positive impact, Dreamers welcomes you to join our mission of bridging the gap between ambition and opportunity. Together, we can create a brighter future for aspiring students and inspire hope for generations to come.</p>
        <p>Thank you for choosing Dreamers. We look forward to embarking on this journey with you.</p>
        <p>Warm regards,</p>
        <p>Harshit Sharma<br>
        Founder of Dreamers <br>
        Dreamers Team</p>
        ` // HTML formatted body
    };
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            req.flash('success', 'Welcome! You have successfully signed up.');
            res.redirect('/')
        }
    });
      res.redirect('/donors');
  } catch (error) {
      console.error(error);
      const deletedStudent = await Student.findByIdAndDelete(studentId)
   console.log(deletedStudent);
      res.status(500).send("Internal Server Error {sorry Your page 1 data is reset so again fill up the form }");
  }
});



app.post('/sinUp', async (req, res) => {

  try {
      const { name, number, email, role, password } = req.body;

      // Check if any of the required fields are missing
      if (!name || !number || !email || !role || !password) {
          return res.status(400).json({ error: "Missing required fields" });
      }
      // Check if the email already exists in the database
const existingUser = await SinUp.findOne({ email: email });
if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
}

      // Hash the password using bcrypt
      const hashedPassword = await  bycrpt.hash(password, 10);
      const token = jwt.sign({ email: email }, 'this is my first secrectin cookie', { expiresIn: '1h' }); // Adjust expiration as per your requirement
      // Create a new SinUP instance with the hashed password
      const userSignup = new SinUp({
          name,
          number,
          email,
     role,
          password: hashedPassword ,// Store the hashed password
          token: token // Store the token
      });

      // Save the userSignup instance to the database
      await userSignup.save();

      // Create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          service: 'Gmail',
          port:465,
          logger:true,
          debug:true,
          secure:true,
          secureConnection:false,

          auth: {
            user: 'dremersio@gmail.com', // Your Gmail email address
            pass: 'fdmp qqny iupt yfly'
          },
          tls:{
              rejectUnAuthorized:true,
          }
      });

      let mailOptions = {
          from: 'dremersio@gmail.com', // Sender address
          to: email, // List of receivers
          subject: 'Welcome to Dremers', // Subject line
          html: `<p>Dear ${name} you succesfully registered is dremers </p>
          <p>Dremers is a unique platform dedicated to fostering the dreams of ambitious students who aspire for greater heights but are hindered by financial constraints. As a student, you have the opportunity to seek financial assistance to fuel your academic journey, while as a donor, you can make a meaningful difference by supporting deserving children in need.</p>
          <p>At Dremers, we believe in the power of education to transform lives and communities. We provide a platform where students can turn their aspirations into reality, regardless of their financial circumstances. Our community of donors generously contributes to the academic endeavors of bright young minds, empowering them to pursue their dreams without limitations.</p>
          <p>Whether you are a student seeking support or a donor looking to make a positive impact, Dremers welcomes you to join our mission of bridging the gap between ambition and opportunity. Together, we can create a brighter future for aspiring students and inspire hope for generations to come.</p>
          <p>Thank you for choosing Dremers. We look forward to embarking on this journey with you.</p>
          <p>Warm regards,</p>
          <p>Harshit Sharma<br>
          Founder of Dremers <br>
          Dremers Team</p>
          ` // HTML formatted body
      };
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              res.status(500).send('Error sending email');
          } else {
              console.log('Email sent: ' + info.response);
              req.flash('success', 'Welcome ' + name + '! You have successfully signed up.');
              res.redirect('/')
          }
      });

      // Redirect to the home page after successful registration
      // res.redirect("/");

  } catch (error) {
      console.error(error);
      req.flash('error', 'Internal server error'); // Set flash message for error
    //  res.status(500).json({ error: "Internal server error" });
  }
});

//////////////////////////////////////######## FORGOT PASSWORD ############////////////////////////////////
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.get('/resetpassword', (req, res) => {
  res.render("listings/forgotpassword.ejs");
});


// Route to send reset password email and verification code
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
      const user = await SinUp.findOne({ email });
      if (!user) {
          res.send("Sorry, no user found with this email");
      } else {
          const id = user._id;
          const verificationCode = generateVerificationCode();
          
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  port:465,
  logger:true,
  debug:true,
  secure:true,
  secureConnection:false,

  auth: {
    user:'dremersio@gmail.com', // Your Gmail email address
    pass:'fdmp qqny iupt yfly',
  },
  tls:{
      rejectUnAuthorized:true,
  }
});
          // Send verification code to user's email
          const mailOptions = {
              from: 'dremersio@gmail.com', // Replace with your email
              to: email,
              subject: 'Password Reset Verification Code',
              html: `
              <p>Dear User,</p>
              <p>Please use the following link to reset your password:</p>
              <h3>${verificationCode}</h3>
              <p>If you did not request a password reset, you can ignore this email.</p>
          `
          };
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.error(error);
                  res.status(500).send("Error sending verification code");
              } else {
                  console.log('Email sent: ' + info.response);
                  // Render the reset password page with the user's id and verification code
                  res.render('listings/resetpassword.ejs', { id, verificationCode });
              }
          });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});


app.post('/resetnow', async (req, res) => {
  const { password, confirm, id ,code,verificationCode} = req.body;
  if (password !== confirm) {
    res.status(500).send("Internal Server Error");
    return; // Added to prevent further execution
  }
    // Check if the verification code matches
    if (code !== verificationCode) {
      res.send("Invalid verification code");
      return;
  }

  try {
    // Use await with findByIdAndUpdate
    console.log(password);
    const hashedPassword = await  bycrpt.hash(password, 10);
    const user = await SinUp.findByIdAndUpdate(id, { password: hashedPassword });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.redirect('/sinIn')
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


/////////////////////////////////////######### end up password #############//////////////////////////////  
app.post('/sinIn', async (req, res) => {
  try {
      const { email, password,role } = req.body;

      // Find the user by email in the database
      const user = await SinUp.findOne({ email});

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
        // Check if the role matches the user's role
        if (user.role !== role) {
          return res.status(401).json({ error: "Role does not match the user" });
      }
      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await bycrpt.compare(password, user.password);

      // Check if the passwords match
       if (!isPasswordMatch) {
          return res.status(401).json({ error: "Wrong password or may Be duplicate Email is trying " });
      }

      // Passwords match, sign in successful
      // Set the user data in the session to indicate that the user is authenticated
      req.session.user = {
          id: user._id,
          email: user.email,
          role: user.role 
          // Add more user data if needed
      };

      // Redirect to the home page or any other page after successful sign-in
      req.flash('success', 'Welcome back! You have successfully signed in.');
      
if(user.role=='donor'){
  const data = await Student.find();
  res.render("listings/test.ejs",{data})
}
if(user.role='student'){
  const donerdata = await Doner.find();
  res.render('listings/doners.ejs',{donerdata})
}
  } catch (error) {
      console.error(error);
      req.flash('error', 'Invalid credentials'); // Set flash message for error
      res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/hello", async(req,res)=>{
  const data = await Student.find()

  res.render("listings/test.ejs",{data})
});
// Assuming you have a route like this in your Express app
app.get('/search', async (req, res) => {
  try {
      const caste = req.query.caste; // Assuming the query parameter is 'caste'
      // Perform a database query to find users based on the caste
      const users = await Student.find({ Caste: caste }); // Adjust 'Caste' according to your schema

      res.render('listings/filter.ejs', { data: users }); // Send filtered users to the template
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/students',isAuthenticatedstudent,async(req,res)=>{
  const data = await Student.find();
  res.render('listings/test.ejs',{data})
})
  
app.get('/donors',async(req,res)=>{
  const donerdata = await Doner.find();
  res.render('listings/doners.ejs',{donerdata})
})


app.get('/sendEmail',(req,res)=>{
  const donorId = req.query.donorId;
  res.render("listings/email.ejs",{donorId})
})
app.post('/mail', async (req, res) => {
  // Retrieve form data from the request body
  const { emailSubject, emailContent, donorId, usermail } = req.body;
  console.log(emailSubject, emailContent, donorId, usermail);

  try {
    // Assuming Doner is your model
    const donor = await Doner.findById(donorId);
    console.log(donor)
    const Email = donor.Email;
   /* if (!donor || !donor.Email) {
      // Handle the case where the donor or their email is not found
      return res.status(404).send('Donor or email not found');
    }*/

   // Check if the email retrieved from the database is valid
  /*  const email = donor.email;
    if (!isValidEmail(email)) {
      return res.status(400).send('Invalid email');
    }*/

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER, // Your Gmail email address
        pass: process.env.PASS // Your Gmail password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: 'dremersio@gmail.com', // Sender address
      to: Email, // List of receivers
      subject: emailSubject || 'Welcome to Dremers', // Subject line
      text: emailContent || 'Welcome to Dremers' // Email content
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent:', info.response);
        req.flash('success', 'Welcome! You have successfully signed up.');
        return res.redirect('/');
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// Function to validate email
function isValidEmail(email) {
  // Use a regular expression for basic email validation
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

///////////////////////////////####### ADMIN && SCHOLERSHIPS #################/////////////////////////////////////////////////////////////////////
app.get("/scholarshipsc", async(req, res) => {
 const scholarships = await Scholer.find();
 res.render('listings/displyscholer.ejs',{scholarships})
});
app.get('/h',(req,res)=>{
  res.render('listings/scholar.ejs')
})
app.post('/scholerships',async(req,res)=>{


try {
  const{sname,Eligibility, deadline,Descripition,Image,criteria,Link} = req.body;

  // Check if any of the required fields are missing
  if (!sname || !Eligibility || !deadline || !Descripition || !Image||!criteria||!Link) {
      return res.status(400).json({ error: "Missing required fields" });
  }

 
  // Create a new SinUP instance with the hashed password
  const newScholership = new Scholer({
 // Store the hashed password
 sname,Eligibility, deadline,Descripition,Image,criteria,Link
  });

  // Save the userSignup instance to the database
  const newscholer = await newScholership.save();
  console.log(newscholer);
  res.redirect('/')


} catch (error) {
  console.error(error);
  req.flash('error', 'Invalid credentials'); // Set flash message for error
  res.status(500).json({ error: "Internal server error" });
}
})
// Assuming you have an array of scholarships named scholarships

app.get('/homepagescholership',(req,res)=>{
  res.render('listings/scholershipHomepage.ejs')
})
app.get('/EducationLoans',async(req,res)=>{
  try {
    const educationLoans = await EducationLoan.find();
    res.render('listings/educationLoan.ejs',{educationLoans})
} catch (err) {
    console.error('Error fetching education loans:', err);
    res.status(500).send('Internal Server Error');
}


})
app.get('/EducationLoanForm',(req,res)=>{
  res.render('listings/educationLoanInput.ejs')
})
app.get('/education',(req,res)=>{
  res.render("listings/help.ejs")
}
)



app.post('/Loanstory',async(req,res)=>{
 
  try {
    const {studentName,bankName,bankerName,phoneNumber,branch,Story,Image } = req.body;

    // Check if any of the required fields are missing
    if (!studentName|| !bankName || !bankerName || !phoneNumber || !branch||!Story||!Image) {
        return res.status(400).json({ error: "Missing required fields" });
    }

 
    // Create a new SinUP instance with the hashed password
    const Loanstory = new EducationLoan({
      studentName,bankName,bankerName,phoneNumber,branch,Story,Image // Store the hashed password
    });

    // Save the userSignup instance to the database
    await Loanstory.save();
    res.redirect('/')
  }catch (error) {
    console.error(error);
    req.flash('error', 'Invalid credentials'); // Set flash message for error
    res.status(500).json({ error: "Internal server error" });
  }

})
app.get('/aboutus',(req,res)=>{
  res.render('listings/aboutme.ejs')
})
app.get('/admin', async (req, res) => {
  try {
      const donorcount = await Doner.countDocuments({});
      const studentcount = await Student.countDocuments({});
      const sinupcount = await SinUp.countDocuments({});
      console.log(donorcount,studentcount,sinupcount);
      res.render('listings/admin.ejs', {donorcount,studentcount,sinupcount});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/admindonor',async(req,res)=>{
  if(req.session.role=='admin'){

  
  const donor = await Doner.find();
  res.render('listings/admindonor.ejs',{donor})}else{
    res.redirect('/')
  }
})
app.get('/admindeletedonor/:donorId',async(req,res)=>{
  try {

    const{donorId} = req.params;
  const user = await Doner.findByIdAndDelete(donorId)
  console.log("user is deleted " + user)
  res.redirect('/admindonor')
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}

})
app.get('/adminstudent',async(req,res)=>{
if(req.session.role =='admin'){
  const student = await Student.find();
  res.render('listings/adminstudent.ejs',{student})}
  else{
    res.redirect('/')
  }
})
app.get('/admindeletestudent/:student_id',async(req,res)=>{
  try {

    const{student_id} = req.params;
  const user = await Student.findByIdAndDelete(student_id)
  console.log("user is deleted " + user)
  res.redirect('/adminstudent')
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}

})

app.get('/adminsinup',async(req,res)=>{
  if(   req.session.role =='admin'){
  const sinup = await SinUp.find();
  res.render('listings/adminsinup.ejs',{sinup})}else{
    res.redirect('/')
  }
})
app.get('/admindeletesinup/:sinup_id',async(req,res)=>{
  try {

    const{sinup_id} = req.params;
  const user = await Student.findByIdAndDelete(sinup_id)
  console.log("user is deleted " + user)
  res.redirect('/adminstudent')
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}

})

app.get('/adminlogin',(req,res)=>{
  res.render('listings/adminsin.ejs')
})
app.post("/adminsinIn",(req,res)=>{
  try{
    const{email,role,password} = req.body;
    if(email!='programming966051@gmail.com'){
      res.redirect('/');
    }
    else if(role!="Admin" ){
      res.redirect('/');
    }
   else  if(password!='966051harshit'){
res.redirect('/');
    }
    else{
      req.session.role = 'admin';
    
      res.redirect('/admin');
    }
  }catch{
    console.error(error);
    res.status(500).send('Internal Server Error');
  }


})

app.get('/adminReview',async(req,res)=>{
  if(   req.session.role =='admin'){
  const review = await Review.find();

  res.render('listings/adminReview.ejs',{review})}
  else{
res.redirect('/')
  }
})
app.get('/admindeletReview/:review_id',async(req,res)=>{
  try {

    const{review_id} = req.params;
  const user = await Review.findByIdAndDelete(review_id)
  console.log("user is deleted " + user)
  res.redirect('/adminReview')
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}

})


///////////////////////////////####### ADMIN && SCHOLERSHIPS  END #################///////////////////////////////////////////////////////////////

///////////////////////////////####### Studnets catagoery Start #################//////////////////////////////

//GENERL

app.get('/genstudent',async(req,res)=>{
  try{
  const Generl= 'Gen' 
  const generalstudent = await Student.find({Caste:Generl});
  res.render("listings/genStudent",{generalstudent});
  }catch(err){
res.status(500).send("internal error "+ err);
  }

})
//OBC
app.get('/obcstudent',async(req,res)=>{
  try{
  const obc= 'OBC' 
  const OBCstudent = await Student.find({Caste:obc});
  res.render("listings/obcStudent",{OBCstudent});
  }catch(err){
res.status(500).send("internal error "+ err);
  }

})

//SC 
app.get('/scstudent',async(req,res)=>{
  try{
  const SC= 'SC' 
  const SCstudent = await Student.find({Caste:SC});
  res.render("listings/scStudent",{SCstudent});
  }catch(err){
res.status(500).send("internal error "+ err);
  }

})
app.get('/ststudent',async(req,res)=>{
  try{
  const ST= 'ST' 
  const ststudent = await Student.find({Caste:ST});
  res.render("listings/stStudent",{ststudent});
  }catch(err){
res.status(500).send("internal error "+ err);
  }

})
app.get('/otherstudent',async(req,res)=>{
  try{
  const other= 'OTHER' 
  const otherstudent = await Student.find({Caste:other});
  res.render("listings/otherStudent",{otherstudent});
  }catch(err){
res.status(500).send("internal error "+ err);
  }

})
app.get('/g',(req,res)=>{
  res.render("listings/aboutus2.ejs")
})
app.get('/error',(req,res)=>{
  res.render('listings/error.ejs')
})
///////////////////////////////########## Comment  & review ###########////////////////////////
app.get('/review',(req,res)=>{
  res.render('listings/review.ejs')
})
app.post('/submit_review', upload.fields([
  { name: 'photo', maxCount: 1 },
]), async (req, res) => {
  try {
    const { name, review, role, rating } = req.body;
    if (!name || !review || !role || !rating) {
      return res.status(400).send("Please provide all required fields.");
    }

    if (!req.files || !req.files['photo'] || req.files['photo'].length === 0) {
      return res.status(400).send("Please upload a photo.");
    }

    const photo = await uploadToCloudinary(req.files['photo'][0]);
    if (!photo) {
      return res.status(500).send("Failed to upload photo.");
    }

    console.log(name, review, role, rating, photo);
    const Reviewstore = await new Review({ name, review, role, rating, photo });
    const savereview =  await Reviewstore.save();

    console.log(savereview);

    res.redirect('/')
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});
