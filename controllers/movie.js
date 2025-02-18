const Movie = require("../models/Movie");

// Add movie
module.exports.addMovie = (req, res) => {

	let newMovie = new Movie({
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	})

	Movie.findOne({title: req.body.title})
	.then(movieExists => {
		if(movieExists) {
			return res.status(409).send({ message: 'Movie already exists' })
		} else {
			return newMovie.save()
			.then(result => {
				res.status(201).send({
					message: 'Movie created successfully',
					movie: result 
				})
			})
			.catch(error => {
				console.error("Error saving movie:", error); 
				res.status(500).send({ message: 'Error saving movie' }); 
			})
		}
	})
	.catch(error => {
		console.error("Error finding movie:", error); 
		res.status(500).send({ message: 'Error checking for existing movie' }); 
	});

}

// Get all movies
module.exports.getMovies = (req, res) => {
	Movie.find({})
	.then(result => {
		if(result.length > 0) {
			return res.status(200).send(result)
		} else {
			return res.status(404).send({ error: 'No movies found' })
		}
	})
	.catch(error => {
		console.error("Error finding movie:", error); 
		res.status(500).send({ message: 'Error retrieving movies' }); 
	})
}

// Get single movie by ID
module.exports.getMovie = (req, res) => {
	Movie.findById(req.params.id)
	.then(result => {
		if(result) {
			return res.status(200).send(result)
		} else {
			return res.status(404).send({ error: 'No movies found' })
		}
	})
	.catch(error => {
		console.error("Error finding movie:", error); 
		res.status(500).send({ message: 'Error retrieving movie' }); 
	})
}


module.exports.updateMovie = (req, res) => {

	let updatedMovie = {
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	}

	return Movie.findByIdAndUpdate(req.params.id, updatedMovie)
	.then(movie => {
		if(movie) {
			res.status(200).send({ 
				success: true, 
				message: "Movie updated successfully" 
			})
		} else {
			res.status(404).send({ error: "Movie not found" })
		}
	})
	.catch(error => {
		console.error("Error finding movie:", error); 
		res.status(500).send({ message: 'Error retrieving movie' }); 
	})
}


module.exports.deleteMovie = (req, res) => {
	const movieId = req.params.id;

	Movie.findByIdAndDelete(movieId)
	.then(deletedMovie  => {
		if(!deletedMovie ) {
			return res.status(404).send({ error: 'Movie not found' })
		} 

		return res.status(200).send({
			message: 'Movie deleted successfully',
			movie: deletedMovie  
		})
	})
	.catch(error => {
		console.error('Error in deleting movie: ', error);
        return res.status(500).send({ error: 'Error in deleting the movie' });
	})	
}

module.exports.addComment = (req, res) => {
	const movieId = req.params.id;

	Movie.findById(movieId)
	.then(movie => {
		if (!movie) {
			return res.status(404).json({ message: 'Movie not found' });
		}

		const newComment = {
			user: req.user.id,
			comment: req.body.comment,
			date: new Date()
		};

		movie.comments.push(newComment);

		// Save the updated movie
		return movie.save()
			.then(updatedMovie => {
				res.status(200).json({
					message: 'Comment added successfully',
					movie: updatedMovie
				});
			})
		.catch(error => {
			console.error("Error saving comment:", error);
			res.status(500).json({ message: 'Error saving comment' });
		});
	})
	.catch(error => {
		console.error("Error finding movie:", error);
		
		if (error.name === 'CastError' && error.kind === 'ObjectId') {
			return res.status(400).json({ message: 'Invalid movie ID' });
		}

		res.status(500).json({ message: 'Error finding movie' });
	});
};


module.exports.getComments = (req, res) => {
	const movieId = req.params.id;

	Movie.findById(movieId).select('comments')
	.then(movie => {
		if (!movie) {
			return res.status(404).send({ message: 'Movie not found' });
		}

		res.status(200).json({ comments: movie.comments });
	})
	.catch(error => {
		console.error(error);
		res.status(500).json({ message: "Something went wrong, please try again later." });
	});
};

