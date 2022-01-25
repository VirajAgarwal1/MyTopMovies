function LastIndex(movies) {
    let used_ranks = []
    for (let index = 0; index < movies.length; index++) {
        const movie = movies[index];
    
        used_ranks.push(movie["personal_rank"]);    
    }
    
    used_ranks.sort((a,b)=>{return (a-b)});

    if (used_ranks.length == 0) {
        output = 1
    }
    else {
        output = used_ranks[used_ranks.length - 1] + 1
    }
    
    return output
}

module.exports = LastIndex;