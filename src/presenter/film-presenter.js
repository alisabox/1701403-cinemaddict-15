import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import PopupCommentContainer from '../view/popup-comments-container.js';
import {render, remove, RenderPosition, replace, UserAction, UpdateType, isOnline} from '../utils/utils.js';
import {toast} from '../utils/toast.js';
import Api from '../api/api.js';

const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

const SHAKE_ANIMATION_TIMEOUT  = 600;

const AUTHORIZATION = 'Basic 5FB2054478353FD8D';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const COMMENTS_LOAD_ERROR_MESSAGE = 'Couldn\'t load comments';

const api = new Api(END_POINT, AUTHORIZATION);

const siteBodyElement = document.querySelector('body');

export default class Film {
  constructor(container, changeData, changeModel) {
    this._filmContainer = container;
    this._changeData = changeData;
    this._changeModel = changeModel;

    this._filmCard = null;
    this._popup = null;
    this._popupComments = null;
    this._commentsErrorMessage = COMMENTS_LOAD_ERROR_MESSAGE;

    this._handleRemovePopup = this._handleRemovePopup.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
  }

  init(film) {
    this._film = film;
    this._comments = [];
    const prevFilmCard = this._filmCard;
    const prevPopup = this._popup;

    this._filmCard = new FilmCardView(this._film);
    this._popup = new PopupView(this._film);

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

    if (siteBodyElement.querySelector('.film-details')) {
      replace(this._popup, prevPopup);
      this._handleOpenPopup();
    }

    remove(prevFilmCard);
    remove(prevPopup);
  }

  setViewState(state, comment) {
    switch (state) {
      case State.SAVING:
        this._popupComments.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._popupComments.updateData({
          isDisabled: true,
          isDeleting: true,
          deletingComment: comment,
        });
        break;
    }
  }

  setFormAborting() {
    this._popupComments.updateData({
      isFormShaking: true,
    });
    setTimeout(() => {
      this._popupComments.updateData({
        isDisabled: false,
        isFormShaking: false,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setCommentAborting() {
    this._popupComments.updateData({
      isCommentShaking: true,
    });
    setTimeout(() => {
      this._popupComments.updateData({
        isDisabled: false,
        isDeleting: false,
        isCommentShaking: false,
        deletingComment: null,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _renderFilmInfo() {
    this._filmCard.setOpenPopupHandler(this._handleOpenPopup);

    render(this._filmContainer, this._filmCard, RenderPosition.BEFOREEND);
  }

  _removeOldPopup() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
      this._handleRemovePopup();
    }
  }

  renderNewComments() {
    const prevComments = this._popupComments;
    api.getComments(this._film.id)
      .then((comments) => {
        this._comments = comments;
        remove(prevComments);
        this._popupComments = new PopupCommentContainer(this._film, this._comments);
        this._popupComments.setDeleteClickHandler(this._handleDeleteClick);
        this._popupComments.setCommentSubmitHandler(this._handleCommentSubmit);
        render(this._popup.getElement().querySelector('.film-details__bottom-container'), this._popupComments, RenderPosition.BEFOREEND);
        this._popupComments.scrollDown();
      });
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this._handleRemovePopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_STATS,
      UpdateType.WATCHLIST,
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
      UserAction.UPDATE_STATS,
      UpdateType.HISTORY,
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
      UserAction.UPDATE_STATS,
      UpdateType.FAVORITES,
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

  _handleDeleteClick(evt) {
    if (!isOnline()) {
      toast('You can\'t delete comment offline');
      return;
    }

    const listOfComments = Array.from(this._popupComments.getElement().querySelectorAll('.film-details__comment'));
    const deletedCommentIndex = listOfComments.indexOf(evt.target.parentElement.parentElement.parentElement);
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          comments:
          [
            ...this._film.comments.slice(0, deletedCommentIndex),
            ...this._film.comments.slice(deletedCommentIndex + 1),
          ],
        },
      ),
      this._comments[deletedCommentIndex],
    );
  }

  _handleCommentSubmit() {
    if (!isOnline()) {
      this._popupComments.updateData({
        isFormShaking: true,
      });
      return;
    }
    this._popupComments.updateData({
      isFormShaking: false,
    });
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
      ),
    );
  }

  _handleOpenPopup() {
    this._removeOldPopup();
    render(siteBodyElement, this._popup, RenderPosition.BEFOREEND);

    api.getComments(this._film.id)
      .then((comments) => {
        this._comments = comments;
        this._popupComments = new PopupCommentContainer(this._film, this._comments);
        this._popupComments.setDeleteClickHandler(this._handleDeleteClick);
        this._popupComments.setCommentSubmitHandler(this._handleCommentSubmit);
        render(this._popup.getElement().querySelector('.film-details__bottom-container'), this._popupComments, RenderPosition.BEFOREEND);
        // this._popupComments.scrollDown();
      })
      .catch(() => {
        this._comments = [];
        const notLoaded = true;
        this._popupComments = new PopupCommentContainer(this._film, this._comments, notLoaded);
        this._popupComments.setDeleteClickHandler(this._handleDeleteClick);
        this._popupComments.setCommentSubmitHandler(this._handleCommentSubmit);
        render(this._popup.getElement().querySelector('.film-details__bottom-container'), this._popupComments, RenderPosition.BEFOREEND);
      });

    siteBodyElement.classList.add('hide-overflow');

    this._popup.setRemovePopupHandler(this._handleRemovePopup);
    this._popup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popup.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popup.setFavoriteClickHandler(this._handleFavoriteClick);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleRemovePopup() {
    remove(this._popup);
    remove(this._popupComments);
    siteBodyElement.classList.remove('hide-overflow');
  }
}
