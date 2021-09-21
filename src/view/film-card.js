import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const createFilmCard = (films) => {
  const {filmInfo, comments, userDetails} = films;
  const {title, totalRating, genre, description, poster, release} = filmInfo;
  const { watchlist, alreadyWatched, favorite } = userDetails;

  const releaseDate = dayjs(release.date).format('YYYY');
  const duration = filmInfo.runtime > 60 ? `${Math.floor(filmInfo.runtime / 60)}h ${filmInfo.runtime % 60}m` : `${filmInfo.runtime}m`;
  let commentText = '';
  if (comments) {
    commentText = comments.length === 1 ? '1 comment' : `${comments.length} comments`;
  } else {
    commentText = '0 comments';
  }

  const ACTIVE_STATE = 'film-card__controls-item--active';

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${totalRating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${releaseDate}</span>
    <span class="film-card__duration">${duration}</span>
    <span class="film-card__genre">${genre[0]}</span>
  </p>
  <img src="/${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${commentText}</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${ watchlist ? ACTIVE_STATE : '' }" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${ alreadyWatched ? ACTIVE_STATE : '' }" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${ favorite ? ACTIVE_STATE : '' }" type="button">Mark as favorite</button>
  </div>
</article>`;
};
export default class FilmCard extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
    this._openPopupHandler = this._openPopupHandler.bind(this);

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._films);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setOpenPopupHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
