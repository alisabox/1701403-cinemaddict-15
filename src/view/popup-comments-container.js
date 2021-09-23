import dayjs from 'dayjs';
import he from 'he';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

import SmartView from './smart.js';

const ENTER_KEY = 'Enter';
const COMMENTS_LOAD_ERROR_MESSAGE = 'Couldn\'t load comments';

const createPopupComment = (comments, isDeleting, deletingComment, isCommentShaking) => {

  if (comments === false) {
    return '';
  }

  const commentsList = comments.map((item) => {

    const date = dayjs(item.date).format('YYYY/MM/DD HH:mm');
    return `<li class="film-details__comment ${item === deletingComment && isCommentShaking ? 'shake' : ''}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(item.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete" ${item === deletingComment && isDeleting ? 'disabled' : ''}>${item === deletingComment && isDeleting ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`;
  }).join('');
  return `<ul class="film-details__comments-list">${commentsList}</ul>`;
};

const createNewComment = (isFormShaking, emotion, isDisabled, comment) => (
  `<div class="film-details__new-comment ${isFormShaking ? 'shake' : ''}">
    <div class="film-details__add-emoji-label">${ emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}"></img>` : '' }</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" ${isDisabled ?  'disabled' : ''} placeholder="Select reaction below and write comment here" name="comment">${ comment ? comment : '' }</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" ${isDisabled ?  'disabled' : ''} name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" ${isDisabled ?  'disabled' : ''} name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" ${isDisabled ?  'disabled' : ''} name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" ${isDisabled ?  'disabled' : ''} name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`
);

const createPopupCommentContainer = (comments, data) => {
  const {emotion, isDisabled, comment, isDeleting, deletingComment, isFormShaking, isCommentShaking, notLoaded} = data;

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">${notLoaded ? COMMENTS_LOAD_ERROR_MESSAGE : `Comments <span class="film-details__comments-count">${comments.length || 0}</span>`}</h3>
    ${notLoaded
    ? ''
    : createPopupComment(comments, isDeleting, deletingComment, isCommentShaking)}

    ${notLoaded
    ? ''
    : createNewComment(isFormShaking, emotion, isDisabled, comment)}
  </section>`;
};
export default class PopupCommentContainer extends SmartView {
  constructor(film, comments, notLoaded = false) {
    super();
    this._film = film;
    this._comments = comments;
    this._notLoaded = notLoaded;
    this._data = {
      emotion: null,
      comment: null,
      isDisabled: false,
      isDeleting: false,
      isFormShaking: false,
      isCommentShaking: false,
      deletingComment: null,
      notLoaded: this._notLoaded,
    };

    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);
    this._commentTextHandler = this._commentTextHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupCommentContainer(this._comments, this._data);
  }

  _setInnerHandlers() {
    if (!this._notLoaded) {
      this.getElement()
        .querySelector('.film-details__emoji-list')
        .addEventListener('input', this._emojiToggleHandler);
      this.getElement()
        .querySelector('.film-details__comment-input')
        .addEventListener('input', this._commentTextHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCommentSubmitHandler(this._callback.commentSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  scrollDown() {
    const popupElement = document.querySelector('.film-details');
    popupElement.scrollTo({
      left: 0,
      top: popupElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().addEventListener('keydown', (evt) => {
      if (evt.key === ENTER_KEY && (evt.metaKey === true || evt.ctrlKey === true)) {
        this._commentSubmitHandler(evt);
      }
    });
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((comment) => comment.addEventListener('click', this._deleteClickHandler));
  }

  _emojiToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value,
    });
  }

  _commentTextHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _commentSubmitHandler(evt) {
    if (!this._data.emotion || !this._data.comment) {
      return;
    }

    evt.preventDefault();
    this._film = PopupCommentContainer.parseDataToFilm(this._film, this._data);
    this.updateElement();
    this._callback.commentSubmit();
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(evt);
  }

  static parseDataToFilm(film, data) {
    data = Object.assign(
      {},
      data,
      {
        date: dayjs().toDate(),
        author: 'Movie Buff',
      },
    );
    delete data.isDisabled;
    delete data.isDeleting;
    delete data.deletingComment;
    delete data.isFormShaking;
    delete data.isCommentShaking;
    delete data.notLoaded;

    film.comments ? film.comments.push(data) : data;

    return film;
  }
}
