import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import PopupCommentContainer from '../view/popup-comments-container.js';
import {render, remove, RenderPosition, replace} from '../view/utils.js';

const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

const SiteBodyElement = document.querySelector('body');

export default class Film {
  constructor(container, changeData) {
    this._filmContainer = container;
    this._changeData = changeData;

    this._filmCard = null;
    this._popup = null;
    this._popupComments = null;

    this._handleRemovePopup = this._handleRemovePopup.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCard = this._filmCard;
    const prevPopup = this._popup;

    this._filmCard = new FilmCardView(this._film);
    this._popup = new PopupView(this._film);
    this._popupComments = new PopupCommentContainer(this._film);

    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCard.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);

    this._popup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popup.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popup.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCard === null || prevPopup === null) {
      this._renderFilmInfo();
      return;
    }

    if (this._filmContainer.contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
      this._filmCard.setOpenPopupHandler(this._handleOpenPopup);
    }

    if (SiteBodyElement.contains(prevPopup.getElement())) {
      this._handleOpenPopup();
    }

    remove(prevFilmCard);
    remove(prevPopup);
  }

  _renderFilmInfo() {
    this._filmCard.setOpenPopupHandler(this._handleOpenPopup);

    render(this._filmContainer, this._filmCard, RenderPosition.BEFOREEND);
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userDetails:
          {
            watchlist: !this._film.userDetails.watchlist,
            alreadyWatched: this._film.userDetails.alreadyWatched,
            watchingDate: this._film.userDetails.watchingDate,
            favorite: this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userDetails:
          {
            watchlist: this._film.userDetails.watchlist,
            alreadyWatched: !this._film.userDetails.alreadyWatched,
            watchingDate: this._film.userDetails.watchingDate,
            favorite: this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userDetails:
          {
            watchlist: this._film.userDetails.watchlist,
            alreadyWatched: this._film.userDetails.alreadyWatched,
            watchingDate: this._film.userDetails.watchingDate,
            favorite: !this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _removeOldPopup() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
  }

  _handleOpenPopup() {
    this._removeOldPopup();
    render(SiteBodyElement, this._popup, RenderPosition.BEFOREEND);
    render(this._popup.getElement().querySelector('.film-details__bottom-container'), this._popupComments, RenderPosition.BEFOREEND);
    SiteBodyElement.classList.add('hide-overflow');

    this._popup.setRemovePopupHandler(this._handleRemovePopup);
    this._popup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popup.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popup.setFavoriteClickHandler(this._handleFavoriteClick);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleRemovePopup() {
    remove(this._popup);
    remove(this._popupComments);
    SiteBodyElement.classList.remove('hide-overflow');
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this._handleRemovePopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }
}
