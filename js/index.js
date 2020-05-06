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

/**
 * Main search
 * @param {string} param from search query
 */
function search(param) {
    // empty the results
    $(".movie--container").html("");

    if ($("input[name=type]:checked").val() == "both") {
        apiCall(param, "movie");
        apiCall(param, "tv");
    } else {
        var searchType = $("input[name=type]:checked").val();
        console.log($("input[name=type]:checked").val());
        apiCall(param, searchType);
    }
}

/**
 * Ajax call
 * @param {string} param search query from main search
 * @param {string} media check if tv or movie
 */
function apiCall(param, media) {
    // Api url logic
    let apiUrl = "";
    if (media == "movie") {
        apiUrl = "https://api.themoviedb.org/3/search/movie/";
    } else {
        apiUrl = "https://api.themoviedb.org/3/search/tv/";
    }

    const apiKey = "45238788959bfbb11d47d87b302def00";
    let lang = "it-IT";
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
                    let thisItem = results[i];
                    let starVote = calcStars(thisItem.vote_average);
                    let lang = checkFlag(thisItem.original_language);
                    let title = "";
                    let originalTitle = "";
                    let type = "";
                    let background = "";
                    let overview = thisItem.overview.substr(0, 80) + "...";

                    // check if movie or tv show
                    if (media == "tv") {
                        // Title
                        title = thisItem.name;
                        // Type
                        type = "TV show";
                        // Original title
                        originalTitle = thisItem.original_name;
                    } else {
                        // Title
                        title = thisItem.title;
                        // Type
                        type = "Movie";
                        // Original title
                        originalTitle = thisItem.original_title;
                    }

                    // background
                    if (thisItem.backdrop_path != null) {
                        background =
                            "https://image.tmdb.org/t/p/w500" +
                            thisItem.backdrop_path;
                    } else if (thisItem.poster_path != null) {
                        background =
                            "https://image.tmdb.org/t/p/w500" +
                            thisItem.poster_path;
                    } else {
                        background = "http://unsplash.it/500?random&blur";
                    }

                    // set handlebars template
                    var context = {
                        poster: background,
                        movieTitle: title,
                        movieOgTitle: originalTitle,
                        movieLang: lang,
                        movieVote: starVote,
                        type: type,
                        overview: overview,
                    };

                    compileHandlebars(context);
                }
            } else {
                switch (media) {
                    case "movie":
                        $(".movie--container").append(
                            "<div class='error'>Non sono stati trovati film corrispondenti al termine di ricerca.</div>"
                        );
                        break;
                    case "tv":
                        $(".movie--container").append(
                            "<div class='error'>Non sono state trovate serie tv corrispondenti al termine di ricerca.</div>"
                        );
                        break;
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
}

/**
 * Handlebars compiler
 * @param {object} context data from api call
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
 * @param {int} vote from api call
 */
function calcStars(vote) {
    let voteFifth = Math.round(vote / 2);
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

/**
 * Check and return language or flag
 * @param {string} lang from api call
 */
function checkFlag(lang) {
    let languages = ["en", "it"];

    if (languages.includes(lang)) {
        return '<img src="img/' + lang + '.svg" alt="' + lang + '">';
    } else {
        return lang;
    }

    // if (lang == "it") {
    //     return '<img src="img/it.svg" alt="it">';
    // } else if (lang == "en") {
    //     return '<img src="img/en.svg" alt="en">';
    // } else {
    //     return lang;
    // }
}
