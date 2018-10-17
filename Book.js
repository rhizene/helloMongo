const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDatabase');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
	name: String,
	affiliation: String
});

const bookSchema = new Schema({
	title: {type:String, required: true, unique: true},
	year: Number,
	authors: [authorSchema]
});


module.exports = mongoose.model('Book', bookSchema);