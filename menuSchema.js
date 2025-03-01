const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type: String,
    },
    price:{
        type:Number,
        required:true
    }
})


const Menu = new mongoose.model("menu", menuSchema);

module.exports = Menu;