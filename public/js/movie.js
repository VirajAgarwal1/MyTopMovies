const home_icon = document.querySelector('#home_icon svg');

home_icon.addEventListener('click',()=>{
    window.location.href = "/";
});


const edit_icon = document.querySelector('#notBigEdit');

edit_icon.addEventListener('click',()=>{
    const movie_id = Number(document.getElementById('movie_info').getAttribute('data-movie_id'));

    url = '/movie/edit/'+String(movie_id);

    window.location.href = url;
});