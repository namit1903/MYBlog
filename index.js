const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
// const path=require('path')
const cloudinary=require('./config/cloudinaryConfig.js')
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}



//middlewares
dotenv.config()
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload

//method1 using cludinary
//creating storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'images', // Folder in your Cloudinary account
      allowed_formats: ['jpg', 'png', 'jpeg'],
    },
  });
  
  const upload = multer({ storage: storage });


/*
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload=multer({storage:storage})

*/
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})

app.get('/',(req,res)=>{
    app.use(express.static(path.resolve(__dirname,"frontend","dist")));  
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
});
app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})