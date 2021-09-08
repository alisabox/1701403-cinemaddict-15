import AbstractObserver from '../utils/abstract-observer.js';

const FILM_EXTRA_CARDS = 2;

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  getTopRatedFilms() {
    return this._films.filter((film) => film.filmInfo.totalRating > 0)
      .sort((film1, film2) => film2.filmInfo.totalRating - film1.filmInfo.totalRating)
      .slice(0, FILM_EXTRA_CARDS);
  }

  getMostCommentedFilms() {
    return this._films.filter((film) => film.comments.length > 0)
      .sort((film1, film2) => film2.comments.length - film1.comments.length)
      .slice(0, FILM_EXTRA_CARDS);
  }

  update(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update this film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];
    this._notify(updateType, update);
  }
}
