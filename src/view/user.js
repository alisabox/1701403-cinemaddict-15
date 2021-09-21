import AbstractView from './abstract.js';
import {statuses, StatusRates} from './../utils/utils.js';

const createUserStatus = (status) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${status}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserStatus extends AbstractView {
  constructor(watchedFilms) {
    super();
    this._watchedFilms = watchedFilms;
  }

  getTemplate() {
    return createUserStatus(this._getStatus());
  }

  _getStatus() {
    const numberOfWatchedFilms = this._watchedFilms.length;
    return statuses[statuses.findIndex((item) => numberOfWatchedFilms <= StatusRates[item])];
  }
}
