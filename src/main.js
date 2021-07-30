import {createUserStatus} from './view/user.js';
import {createMenuElement} from './view/menu.js';
import {createSortElement} from './view/sort.js';
import {createShowButton} from './view/show-button.js';
import {createLoading} from './view/loading.js';
import {createFilmsContainer, createEmptyList, createFilmsList, createFilmsExtra} from './view/film-list';
import {createFilmCard} from './view/film-card.js';
import {createFooterStats} from './view/footer-stats.js';
import {createPopup} from './view/popup.js';
import {createPopupCommentContainer} from './view/popup-comments-container.js';
import {createPopupComment} from './view/popup-comment';
import {createStats} from './view/stats.js';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

const FILM_CARDS = 5;
const FILM_EXTRA_CARDS = 2;

render(header, createUserStatus(), 'beforeend');
render(main, createMenuElement(), 'beforeend');
render(main, createSortElement(), 'beforeend');
render(main, createFilmsContainer(), 'beforeend');
render(main.querySelector('.films'), createFilmsList(), 'beforeend');
render(main.querySelector('.films'), createFilmsExtra(), 'beforeend');

for (let i = 0; i < FILM_CARDS; i++) {
  render(main.querySelector('.films-list > .films-list__container'), createFilmCard(), 'beforeend');
}

render(main.querySelector('.films-list'), createShowButton(), 'beforeend');


const extras = main.querySelectorAll('.films-list--extra > .films-list__container');
const topRated = extras[0];
const mostCommented = extras[1];

for (let i = 0; i < FILM_EXTRA_CARDS; i++) {
  render(topRated, createFilmCard(), 'beforeend');
  render(mostCommented, createFilmCard(), 'beforeend');
}

render(footerStats, createFooterStats(), 'beforeend');

render(document.querySelector('body'), createPopup(), 'beforeend');

const popup = document.querySelector('.film-details');

render(popup.querySelector('.film-details__bottom-container'), createPopupCommentContainer(), 'beforeend');
render(popup.querySelector('.film-details__comments-list'), createPopupComment(), 'beforeend');

createLoading;
createEmptyList;
createStats;
