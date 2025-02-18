//Routes Middleware
const express = require("express");
const mongoose = require("mongoose");

const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

const port = 4000;

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//MongoDB database
mongoose.connect("mongodb+srv://mico_cali:pass123@cluster0.4ipfp.mongodb.net/movie-API?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));


app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${ process.env.PORT || port }`)
    });
}

module.exports = {app,mongoose};