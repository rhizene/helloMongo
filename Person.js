const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDatabase');

const Schema = mongoose.Schema;

let personSchema = new Schema({
	name: {type: String, required: true, unique: true},
	age: Number
});

module.exports = mongoose.model('Person', personSchema);