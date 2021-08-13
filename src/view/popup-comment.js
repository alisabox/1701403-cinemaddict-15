import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

import AbstractView from './abstract.js';

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
        <img src="./images/emoji/${item.emoji}.png" width="55" height="55" alt="emoji-smile">
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
export default class PopupComment extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createPopupComment(this._films);
  }
}
