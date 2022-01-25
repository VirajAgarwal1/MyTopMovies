const home_icon = document.querySelector('#home_icon svg');

home_icon.addEventListener('click',()=>{
    window.location.href = "/";
});

var searched_movies = document.getElementById('searched_movies');
searched_movies.removeAttribute('id');
searched_movies.classList.add('hide');

var movie_info = document.getElementById('movie_info');
movie_info.removeAttribute('id');
movie_info.classList.add('hide');





var movies_info_global = []

var search_word = document.getElementById('search_word');
// Execute a function when the user releases a key on the keyboard
search_word.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      event.preventDefault();
      // Trigger the button element with a click
      SearchMov();
    }
  });

function SearchMov() {
    const search_word = document.getElementById('search_word');



    if (search_word.value.length == 0 || search_word.value.replace(/\s/g, "").length == 0 || !search_word.value) {
        console.log('Hey!!');
        console.log(search_word.value.length == 0 , search_word.value.replace(/\s/g, "").length == 0 , !search_word.value);
    }
    else {
        let url = '/search?page_num=1&search_word='+search_word.value
    
        fetch(url)
        
        .then((response)=>{
            return response.json()
        })
        
        .then((movies_info)=>{

            movies_info_global = movies_info;
            searched_movies.innerHTML = "";
    
            if (movies_info["total_results"] == 0) {
                searched_movies.id = 'searched_movies';
                searched_movies.classList.remove('hide');
                searched_movies.innerText = "No Movie Found";
            }
            else {
                searched_movies.id = 'searched_movies';
                searched_movies.classList.remove('hide');
                
                for (let index = 0; index < movies_info["results"].length; index++) {
                    const movie = movies_info["results"][index];
    
                    const span_movie = document.createElement('span');
                    searched_movies.appendChild(span_movie);
    
                    span_movie.classList.add('movie_info_in_search');
    
                    const img_movie = new Image();
                    img_movie.src = "https://image.tmdb.org/t/p/original" + movie["poster_path"];
    
                    span_movie.appendChild(img_movie);
    
                    span_movie.append(movie["title"]);
    
                    span_movie.setAttribute("data-movie_id" , movie["id"]);

                    span_movie.addEventListener('click',()=>{
                        let movie_poster = document.querySelector('#movie_poster img');
                        movie_poster.src = "https://image.tmdb.org/t/p/original" + movie["poster_path"];
            
                        let line_1 = document.getElementById('line_1');
                        line_1.innerText = movie["title"];

                        movie_info.setAttribute('data-movie_id' , movie["id"]);

                        movie_info.id = 'movie_info';
                        movie_info.classList.remove('hide');
                    })
                }
            }
        })
    }
    


}



const search_and_results = document.getElementById('search_and_results');

document.addEventListener("mouseup", (event)=>{
    var obj = search_and_results;
    if (!obj.contains(event.target)) {
        searched_movies.removeAttribute('id');
        searched_movies.classList.add('hide');
    }
})



const submitBtn = document.querySelector('#line_6 button');

submitBtn.addEventListener('click',()=>{
    let personal_rating_input = Number(document.getElementById('personal_rating_input').value);
    let personal_rank_input = Number(document.getElementById('personal_rank_input').value);

    if (!personal_rating_input || String(personal_rating_input).length == 0) {
        alert('Oops! Something went wrong while processing the inputs. Could you pleae check them once?')
    }
    else {
        let movie_id = Number(movie_info.getAttribute('data-movie_id'));

        response_Json = {
            'movie_id' : movie_id,
            'personal_rating' : personal_rating_input,
            'personal_rank' : personal_rank_input
        }
    
        options = {
            'method' : 'POST',
            headers: {'Content-Type' : 'application/json'},
            'body' : JSON.stringify(response_Json)
        }
    
        fetch('/',options)
    
        .then((res)=>{
            return res.json();
        })
    
        .then((data)=>{
            alert(data["message"]);
        })
    
        .then(()=>{
            window.location.replace('/') ;
        })
    }



});


let personal_rating_input = document.getElementById('personal_rating_input');
let personal_rank_input = document.getElementById('personal_rank_input');


personal_rating_input.addEventListener('input',()=>{
    let personal_rating = Number(personal_rating_input.value);
    if (personal_rating > 10  || personal_rating < 0 ) {
        document.getElementById('personal_rating_input').value = 0;
        alert('Persnal Rating can only be a number between 0 and 10. ')
    }
})

personal_rank_input.addEventListener('input',()=>{
    let personal_rank = Number(personal_rank_input.value)

    if (personal_rank < 0) {
        document.getElementById('personal_rank_input').value = 0;
        alert('Persnal Rank can only be a number greater than 0.')
    }
})

