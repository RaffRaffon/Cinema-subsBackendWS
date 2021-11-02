const mongoose = require('mongoose');

let MemberSchema = new mongoose.Schema({
   Name:String,
   Email:String,
   City:String,
   MoviesArr:Array
})

module.exports = mongoose.model('members',MemberSchema);
