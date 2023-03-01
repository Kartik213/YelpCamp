const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})

//this will add the username and password field in uor schema
//also gives us some methods to use
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
