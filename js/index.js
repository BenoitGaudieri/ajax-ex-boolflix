$(document).ready(function () {
    // Reference
    var button = $(".btn");

    // Init handlebars
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);

    button.click(() => {
        event.preventDefault();
        search($(".movie-search").val(), template);
    });

    //
}); // end Doc ready

/**
 * Functions
 */

//  search

function search(param, template) {
    // Api refs
    const apiUrl = "https://api.themoviedb.org/3/search/movie/";
    const apiKey = "45238788959bfbb11d47d87b302def00";
    let lang = "it-IT";

    // empty the results
    $(".movie--container").html("");

    // Api call
    $.ajax({
        url: apiUrl,
        method: "GET",
        // Api data
        data: {
            api_key: apiKey,
            query: param,
            language: lang,
        },
        success: function (res) {
            let results = res.results;

            // Loop through all the results
            for (let i = 0; i < results.length; i++) {
                let thisMovie = results[i];

                // set handlebars template
                var context = {
                    movieTitle: thisMovie.title,
                    movieOgTitle: thisMovie.original_title,
                    movieLang: thisMovie.original_language,
                    movieVote: thisMovie.vote_average,
                };

                // compile and append template
                var html = template(context);
                $(".movie--container").append(html);
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
}
