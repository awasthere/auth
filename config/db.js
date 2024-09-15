const mongoose= require('mongoose');


main().then((res)=>{
    console.log("database connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/auth');
}


const userSchema =mongoose.Schema({
    username: String,
    password: String
})

const userModel= mongoose.model("userModel", userSchema);

module.exports=userModel;