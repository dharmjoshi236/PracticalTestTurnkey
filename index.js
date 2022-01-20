const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('./connection')



const UserModel = require('./models/user')

app.use(express.json())

app.get("/", (req,res)=>{
    res.send("this is the first test route for checking the working of the application")
})


//signup route post request
app.post("/signup", async (req,res) =>{

    try{ 
        const user = await new UserModel(req.body)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt)

        await user.save()
        .then(()=>{
            console.log('data',user)
        })
        .catch((e)=>{
            console.log("there is some problem in saving the data")
            
        })
        
        res.status(201).json({
            data: user,
            message: "User details saved succesfully"
        })
    }
    catch{
        console.log("There is problem in the first try block of the post request")
    }
   
    
})


// get request for getting array of users present in the database
app.get('/allUsers', async(req,res)=>{
    const usersDetail = await UserModel.find()
    
    if(usersDetail.length==0){
        res.json({
            message:"NO data found"
        })
    }

    res.status(200).json({
        data:
            usersDetail

    })
})


//login post request to log the user into the system
app.post('/login', async(req,res)=>{

    const userDetail = await UserModel.findOne({email: req.body.email})
    if(userDetail){
        
        const validPassword = await bcrypt.compare(req.body.password,userDetail.password)
         if(validPassword){

            const token =  jwt.sign(
                { user_id: userDetail._id },
                "thisisthesecreat",
                {
                    expiresIn:"10h"
                }
            )
                
              

             console.log("user logged in succesfully")
             res.status(200).json({
                 message:"user logged in succesfully",
                 token:token
             })
         }
         else{
             console.log("password is incorrect")
             res.status('401').json({
                 message:"invalid password, Pls enter the correct password"
             })
         }
    }
    else{
        console.log('This email is not Registered')
        res.status(401).json({
            message:"Pls enter the correct email for login the account"
        })
    }
})


// get the user data using jwt token 
app.get('/getuser', async(req,res)=>{
    
    const token = req.header('auth-token')
    if(!token){
        res.status(401).json({
            message:"Token is needed for this route to work"
        })
    }

    try{

        const verified =  jwt.verify(token,"thisisthesecreat")
        
        if(verified){
            const userDetails = await UserModel.findOne({_id:verified.user_id})
            res.status(200).json({
                data:userDetails,
                token:token
            })
        }
    }catch{
        res.status(401).json({
            message:"Token is not valid, Please login again"
        })
    }
    
   
})




app.listen(3000,()=>{
    console.log("server is listening on the port 3000")
})