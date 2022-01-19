const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/turnkeytestdb').then(()=>{
    console.log("Mongodb database connected succesfully")
}).catch((e)=>{
    console.log("there is problem in the connection of the database")
})

module.exports