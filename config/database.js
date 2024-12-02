const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/host2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const userModel = mongoose.model('User', userSchema);


module.exports = userModel;
