
// sort can be name/stars/rating/rank can be any one of these...
function sort_filter_JSON(movies_orignal ,sort='rank' , filter='') {
  let movies = [...movies_orignal];
  
  // sort can be name/stars/rating/rank can be any one of these...

  let sort_field = ""
  final_movies_list = []


  if (sort == "rating" || sort == "stars") {
    if (sort == 'stars'){
      sort_field = 'rating';
    }
    else if (sort == 'rating'){
      sort_field = 'personal_rating';
    }

    movies.sort((firstEl , secondEl)=>{
      return secondEl[sort_field] - firstEl[sort_field]
    });
  }
  else if (sort == "rank") {
    sort_field = 'personal_rank';

    movies.sort((firstEl , secondEl)=>{
      return firstEl[sort_field] - secondEl[sort_field]
    });
  }
  else if (sort == "name") {
    sort_field = 'name';

    movies.sort((firstEl , secondEl) => {
      let name_1 = firstEl[sort_field].toUpperCase();
      let name_2 = secondEl[sort_field].toUpperCase();

      if (name_1 < name_2) {
        return -1
      }
      else if (name_1 > name_2) {
        return 1
      }
      else {
        return 0
      }
    });
  }

  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index];
    if (movie['name'].toLowerCase().includes( filter.toLowerCase() )) {
      if (movie['name'].length > 17) {
        let t = movie['name']
        movie['name'] = t.slice(0,17)+'...'
      }
      final_movies_list.push(movie);
    }
  }

  return final_movies_list
}


module.exports = sort_filter_JSON;

