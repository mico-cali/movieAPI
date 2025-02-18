const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is required']
	},
	director: {
		type: String,
		required: [true, 'Director is required']
	},
	year: {
		type: Number,
		required: [true, 'Year is required']
	},
	description: {
		type: String,
		required: [true, 'Description is required']
	},
	genre: {
		type: String,
		required: [true, 'Genre is required']
	},
	comments: [{
		user: {
			type: String,
			required: true
		},
		comment: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			default: Date.now 
		}
	}],
	createdAt: { // For tracking creation time
		type: Date,
		default: Date.now
	},
	updatedAt: { // For tracking updates
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Movie', movieSchema);