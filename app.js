const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const https = require('https');
const sort_filter_JSON = require('./sort_function');
const LastIndex = require('./LastIndex');


api_key = //API Key For 'The Movie Databse' v3;

dbName = 'MoviesDB';
port = '27017';
dbUrl = 'mongodb://localhost:'+port+'/' + dbName;

try {
    mongoose.connect(dbUrl);
  } catch (error) {
    handleError(error);
  };

const moviesSchema = new mongoose.Schema({
    movie_id: {
        type: Number,
        required: [true,'Movie being added needs a movie_id... <app.js>']
    },
    name: {
        type: String,
        required: [true,"Movie being added needs a name... <app.js>"]
    },
    genres : {
        type: Array,
        required: [true,"Movie being added needs tags_ids... <app.js>"]
    },
    rating: Number,
    personal_rating: {
        type: Number,
        required: [true,"Movie being added needs a personal_rating... <app.js>"]
    },
    personal_rank: {
        type: Number,
        required: [true,"Movie being added needs a personal_rank... <app.js>"]
    },
    overview: {
        type: String,
        required: [true,"Movie being added needs a overview... <app.js>"]
    },
    poster_path : {
        type: String,
        required: [true,"Movie being added needs a poster_path... <app.js>"]
    }
},{collection:'movies'});

const movies = mongoose.model('movies',moviesSchema);


// Now DB done now we need to set up our server...
const app = express();
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.set("view engine" , 'ejs');


//'CREATE' operation for the database...
app.post('/',(req,res)=>{
    // request body should have a JSON init..
    let movie_id = req.body.movie_id
    let personal_rating = req.body.personal_rating
    let personal_rank = req.body.personal_rank

    let base_url = "https://api.themoviedb.org/3/movie/"+movie_id+"?api_key="+api_key+"&language=en-US"

    movies.find((err,docs)=>{
        if(err){
            reject(err)
        }else{
            let used_ranks = [];
            let used_movie_ids = []
            for (let i = 0; i < docs.length; i++) {
                const movie = docs[i];
                used_ranks.push(movie["personal_rank"]);
                used_movie_ids.push(movie["movie_id"]);
            }
            if(used_movie_ids.indexOf(Number(movie_id)) != -1){
                res.json({"status":400, "message": "Error: The movie specified already exists. To change its rank or rating Please go to edit page."})
            }
            else if (used_ranks.indexOf(personal_rank) != -1){
                res.json({"status":400, "message": "Error: The personal rank specified is already occupied by another Movie."})
            }
            else {

                if (Number(personal_rank) == 0) {
                    personal_rank = LastIndex(docs);
                }

                https.get(base_url , (response)=>{
        
                    let movie_info_extra = []
            
                    response.on('data',(data)=>{
                        movie_info_extra.push(data)
                    });
            
                    response.on('end',()=>{
                        movie_info_extra = JSON.parse(Buffer.concat(movie_info_extra).toString('utf8'))
            
                        movie_info_trim = {
                            movie_id:           movie_id,
                            name:               movie_info_extra["original_title"],
                            genres:             movie_info_extra["genres"],
                            rating:             movie_info_extra["vote_average"],
                            personal_rating:    personal_rating,
                            personal_rank:      personal_rank,
                            overview:           movie_info_extra["overview"],
                            poster_path:        movie_info_extra["poster_path"]
                        }
                        // console.log(movie_info_extra["poster_path"]);
                        const movie = new movies(movie_info_trim);
                        movie.save();
                        console.log('Succcessful addition of record');
                        res.json({"status":200, "message": "Succcessful addition of movie to the Database."})
                    });
                });
            }
        }
    })
});

//'READ' operation for the database...
app.get('/',(req,res)=>{

    filter = req.query.filter;
    sort = req.query.sort;

    movies.find((err,movies)=>{
        if(err){
            console.error(err);
        }else{
            if (filter && sort) {
                req_json = sort_filter_JSON(movies , sort , filter)
            }else if (!filter && sort) {
                req_json = sort_filter_JSON(movies , sort )
            }
            else if (filter && !sort) {
                req_json = sort_filter_JSON(movies , 'rank' , filter)
            }
            else {
                req_json = sort_filter_JSON(movies)
            }
            

            res.render('index',{movies_info:req_json});
        }
    })
});





//API Operations that need to be done...

// Search for movies by name and select the one user wants...
//This request will GET information regarding our search from the API...Although the client GET this information from use anf not directly
// To protect my API key..
app.get('/search',(req,res)=>{

    page_num = req.query.page_num;
    search_word = req.query.search_word;


    base_url = "https://api.themoviedb.org/3/search/movie?api_key="+api_key+"&language=en-US&page="+page_num+"&include_adult=false&query="+search_word;
    
    https.get(base_url,(response)=>{
        let comp_data = [];

        response.on('data',(data)=>{
            comp_data.push(data);
        });

        response.on('end',()=>{
            res.json(JSON.parse( Buffer.concat(comp_data).toString('utf8')));
        });
    }); 
});


// This is how someone like user will access UI that enables them to add Movies to databse...
app.get('/movie/add',(req,res)=>{
    res.render('add');
});


// read opreation for a specific movie but for Edit Page...
app.get('/movie/edit/:movie_id',(req,res)=>{
    let movie_id = Number(req.params.movie_id);

    movies.findOne({"movie_id" : movie_id} , (err , movie_info)=>{
        if (err) {
            console.log(err);
        }
        else {
            res.render('edit' , {movie:movie_info});
        }
    })

    
});

//***********************ROUTE PARAMETERS must come after solid routes...******************************


// Read Operation for specific movie...
app.get('/movie/read/:movie_id',(req,res)=>{

    movies.findOne({"movie_id": req.params.movie_id} , (err, movie)=>{
        if (err) {  
            console.log(err);
        } else {
            res.render('movie' , {movie: movie});
        }
    });
});


//'DELETE' operation for the database...
app.delete('/:movie_id',(req,res)=>{
    // console.log(req.params);
    movies.deleteOne({movie_id: req.params.movie_id},{},(err)=>{
        if (err){
            console.log(err);
        }else{
            console.log('Deletetion of record successful.');
            res.json({status:200 , message:"Deleteion of record successful"});
        }
    });
});

//'UPDATE' operation for the database...
app.put('/:movie_id',(req,res)=>{
    // console.log(req.body);
    if (Number(req.body.personal_rank) == 0) {

        movies.find({},(err,movies_info)=>{
            if(err){
                console.log(err);
            }
            else {
                let personal_rank = LastIndex(movies_info);
                update = {
                    personal_rating : req.body.personal_rating,
                    personal_rank : personal_rank
                }
                movies.updateOne({movie_id : req.params.movie_id}, update , (err)=>{
                    if (err){
                        console.log(err);
                    }else{
                        res.json({status:200 , message:'Record updation successful.'})
                        console.log('Successful Update');
                    }
                });
            }
        })
    }

    else {
        movies.updateOne({movie_id : req.params.movie_id}, req.body , (err)=>{
            if (err){
                console.log(err);
            }else{
                res.json({status:200 , message:'Record updation successful.'})
                console.log('Successful Update');
            }
        });
    }


});





app.listen(5000,()=>{
    console.log('Server started at port 5000...');
});
