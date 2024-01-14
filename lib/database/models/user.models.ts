import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId:{type:String, required:true,unique:true},
    email:{type:String, required:true,unique:true},
    username:{type:String, required:true,unique:true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    photo:{type:String, required:true},
})

const User = models.User || model("User", UserSchema);
export default User;

//In summary, this code sets up a user schema with specific properties and requirements using Mongoose. It then creates a model named "User" based on that schema, ensuring uniqueness for certain fields. Finally, it exports this user model for use in other parts of the application.