const FILM_EXTRA_CARDS = 2;

const getMostRatedFilms = (films) => (
  films.filter((film) => film.filmInfo.totalRating > 0)
    .sort((film1, film2) => film2.filmInfo.totalRating - film1.filmInfo.totalRating)
    .slice(0, FILM_EXTRA_CARDS)
);

const getMostCommentedFilms = (films) => (
  films.filter((film) => film.comments.length > 0)
    .sort((film1, film2) => film2.comments.length - film1.comments.length)
    .slice(0, FILM_EXTRA_CARDS)
);

export {getMostRatedFilms, getMostCommentedFilms};
