const mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
   Name:String,
   Genres:Array,
   Image:String,
   Premiered:Date,
   subsArr:Array
})

module.exports = mongoose.model('movies',MovieSchema);
