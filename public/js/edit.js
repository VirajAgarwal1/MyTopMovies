const home_icon = document.querySelector('#home_icon svg');

home_icon.addEventListener('click',()=>{
    window.location.href = "/";
});



var movie_info = document.getElementById('movie_info');


const submitBtn = document.querySelector('#submit_Btn');

submitBtn.addEventListener('click',()=>{
    let personal_rating_input = Number(document.getElementById('personal_rating_input').value);
    let personal_rank_input = Number(document.getElementById('personal_rank_input').value);

    if (!personal_rating_input || String(personal_rating_input).length == 0) {
        alert('Oops! Something went wrong while processing the inputs. Could you pleae check them once?')
    }
    else {
        let movie_id = Number(movie_info.getAttribute('data-movie_id'));

        response_Json = {
            'personal_rating' : personal_rating_input,
            'personal_rank' : personal_rank_input
        }
    
        options = {
            'method' : 'PUT',
            headers: {'Content-Type' : 'application/json'},
            'body' : JSON.stringify(response_Json)
        }

        var url = "/"+String(movie_id);

    
        fetch(url,options)
    
        .then(()=>{
            window.location.replace('/') ;
        })
    }



});


const removeBtn = document.getElementById('remove_Btn');

removeBtn.addEventListener('click',()=>{
    let movie_id = Number(movie_info.getAttribute('data-movie_id'));

    url = "/"+movie_id;

    options = {
        method : 'DELETE',
    };

    fetch(url , options)
    .then((res)=>{return res.json()})
    .then((data)=>{
        alert(data['message']);
        window.location.replace('/');
    })
})


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