function getSelectedValue () {
let sort = document.getElementById('sort_options').value;

const filter = document.getElementById('filter');

if (filter.value) {
    window.location.replace("http://localhost:5000?sort="+sort+"&filter="+filter.value);
}
else {
    window.location.replace("http://localhost:5000?sort="+sort+"&filter=");
}


}

function UpdateVar() {
    let sort = document.getElementById('sort_options').value;

    const filter = document.getElementById('filter');

    var urlObject = new URL(document.location.href);
    var params = urlObject.searchParams;

    if (params.get('sort') == 'name' || params.get('sort') == 'stars' || params.get('sort') == 'rank' || params.get('sort') == 'rating') {
        document.getElementById('sort_options').value = params.get('sort');
    }
    else {
        document.getElementById('sort_options').selectedIndex = 0;
    }

    
    filter.value = params.get('filter')
}

function getFilterValue() {
    let sort = document.getElementById('sort_options').value;

    const filter = document.getElementById('filter');

    if (filter.value) {
        window.location.replace("http://localhost:5000?sort="+sort+"&filter="+filter.value);
    }
    else {
        window.location.replace("http://localhost:5000?sort="+sort+"&filter=");
    }
}


const movie_cards = document.getElementsByClassName('movie_card')

for (let index = 0; index < movie_cards.length; index++) {
    const movie = movie_cards[index];
    movie.addEventListener('click',()=>{
        window.location.href = "http://localhost:5000/movie/read/"+movie.getAttribute('data-movie_id')
    })
}

const add_button = document.querySelector('#add svg');

add_button.addEventListener('click',()=>{
    window.location.href = '/movie/add';
});