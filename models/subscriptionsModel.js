const mongoose = require('mongoose');

let subscriptionsSchema = new mongoose.Schema({
    MemberId: mongoose.ObjectId,
    MemberName: String,
    Movies: [{
        movieId: mongoose.ObjectId,
        date: Date
    }
    ]

})

module.exports = mongoose.model('subscriptions', subscriptionsSchema);
