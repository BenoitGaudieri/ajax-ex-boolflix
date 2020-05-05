$(document).ready(function () {
    // Reference
    var button = $(".btn");
    var input = $(".movie-search");

    button.click(() => {
        event.preventDefault();
        if (input.val() == "") {
            alert("Inserisci un valore per la ricerca");
        } else {
            search($(".movie-search").val().trim().toLowerCase());
        }
    });

    input.keyup(function (e) {
        if (e.which == 13 || e.keyCode == 13) {
            if (input.val() == "") {
                alert("Inserisci un valore per la ricerca");
            } else {
                search($(".movie-search").val().trim().toLowerCase());
            }
        }
    });

    // $(".toggle").click(() => {
    //     console.log($(this));

    //     $(this).prev().toggleClass("ellipsis");
    // });

    //
}); // end Doc ready

/**
 * Functions
 */

//  search

function search(param) {
    // Api refs
    const apiUrl = "https://api.themoviedb.org/3/search/movie/";
    const apiMovUrl = "https://api.themoviedb.org/3/search/movie/";
    const apiTvUrl = "https://api.themoviedb.org/3/search/movie/";
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

            if (results.length > 0) {
                // Loop through all the results
                for (let i = 0; i < results.length; i++) {
                    let thisMovie = results[i];
                    let starVote = calcStars(thisMovie.vote_average);
                    let lang = checkFlag(thisMovie.original_language);
                    // console.log(thisMovie);

                    // set handlebars template
                    var context = {
                        movieTitle: thisMovie.title,
                        movieOgTitle: thisMovie.original_title,
                        // movieLang: thisMovie.original_language,
                        movieLang: lang,
                        // movieVote: thisMovie.vote_average,
                        movieVote: starVote,
                        // overview: thisMovie.overview,
                    };

                    compileHandlebars(context);
                }
            } else {
                alert("Nessun film trovato");
                $(".movie-search").select();
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
}

/**
 * Handlebars compiler
 * @param {context} object data
 */
function compileHandlebars(context) {
    // Init handlebars
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);

    // compile and append context object
    var html = template(context);
    $(".movie--container").append(html);
}

/**
 * Vote in fifths with stars
 * @param {int} vote
 */
function calcStars(vote) {
    console.log(vote);
    let voteFifth = Math.round(vote / 2);
    console.log(voteFifth);

    let result = "";

    for (let i = 0; i < 5; i++) {
        if (voteFifth > 0) {
            result += '<i class="fas fa-star"></i>';
            voteFifth -= 1;
        } else {
            result += '<i class="far fa-star"></i>';
        }
    }
    return result;
}

function checkFlag(lang) {
    if (lang == "it") {
        return '<img src="img/it.svg" alt="it">';
    } else if (lang == "en") {
        return '<img src="img/en.svg" alt="en">';
    } else {
        return lang;
    }
}
