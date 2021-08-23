import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

import SmartView from './smart.js';

const createPopupComment = ({comments}) => {
  if (comments === false) {
    return '';
  }

  const commentsList = comments.map((item) => {
    const date = dayjs(item.date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'd [days ago]',
      sameElse: 'YYYY/MM/DD HH:MM',
    });

    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${item.emoji}.png" width="55" height="55" alt="emoji-${item.emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${item.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }).join('');
  return `<ul class="film-details__comments-list">${commentsList}</ul>`;
};

const createPopupCommentContainer = (films, newComment) => {
  const {comments} = films;

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length || 0}</span></h3>
    ${createPopupComment(films)}
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${ newComment.emoji ? `<img src="images/emoji/${newComment.emoji}.png" width="55" height="55" alt="emoji-${newComment.emoji}"></img>` : '' }</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${ newComment.comment ? newComment.comment : '' }</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  </section>`;
};
export default class PopupCommentContainer extends SmartView {
  constructor(film) {
    super();
    this._film = film;

    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);
    this._commentTextHandler = this._commentTextHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._setInnerHandlers();
    this._setCommentSubmitHandler();
  }

  getTemplate() {
    return createPopupCommentContainer(this._film, this._data);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('input', this._emojiToggleHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setCommentSubmitHandler();
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

    film.comments ? film.comments.push(data) : data;

    return film;
  }

  _emojiToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.value,
    });
  }

  _commentTextHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _commentSubmitHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey === true || evt.ctrlKey === true)) {

      if (!this._data.emoji || !this._data.comment) {
        return;
      }

      evt.preventDefault();
      this._film = PopupCommentContainer.parseDataToFilm(this._film, this._data);
      this._data = {};
      this.updateElement();
      this._scrollDown();
    }
  }

  _setCommentSubmitHandler() {
    this.getElement().addEventListener('keydown', this._commentSubmitHandler);
  }

  _scrollDown() {
    const popup = document.querySelector('.film-details');
    popup.scrollTo({
      left: 0,
      top: popup.scrollHeight,
      behavior: 'smooth',
    });
  }
}
