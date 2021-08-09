import {createUserStatus} from './view/user.js';
import {createMenuElement} from './view/menu.js';
import {createSortElement} from './view/sort.js';
import {createShowButton} from './view/show-button.js';
import {createLoading} from './view/loading.js';
import {createFilmsContainer, createEmptyList, createFilmsList, createFilmsTopRated, createFilmsMostCommented} from './view/film-list';
import {createFilmCard} from './view/film-card.js';
import {createFooterStats} from './view/footer-stats.js';
import {createPopup} from './view/popup.js';
import {createPopupCommentContainer} from './view/popup-comments-container.js';
import {createPopupComment} from './view/popup-comment';
import {createStats} from './view/stats.js';

import {generateFilmCards} from './mock/film-card-mock.js';
import {getMostRatedFilms, getMostCommentedFilms} from './mock/film-extras.js';

const MAX_FILM_CARDS = 20;
const FILM_CARDS_PER_STEP = 5;

const films = generateFilmCards(MAX_FILM_CARDS);
const mostRatedFilms = getMostRatedFilms(films);
const mostCommentedFilms = getMostCommentedFilms(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');


render(header, createUserStatus(), 'beforeend');
render(main, createMenuElement(films), 'beforeend');
render(main, createSortElement(), 'beforeend');
render(main, createFilmsContainer(), 'beforeend');
render(main.querySelector('.films'), createFilmsList(), 'beforeend');
render(main.querySelector('.films'), createFilmsTopRated(), 'beforeend');
render(main.querySelector('.films'), createFilmsMostCommented(), 'beforeend');

for (let i = 0; i < Math.min(films.length, FILM_CARDS_PER_STEP); i++) {
  render(main.querySelector('.films-list > .films-list__container'), createFilmCard(films[i]), 'beforeend');
}

if (films.length > FILM_CARDS_PER_STEP) {
  let shownFilmsCount = FILM_CARDS_PER_STEP;
  render(main.querySelector('.films-list'), createShowButton(), 'beforeend');

  const showMoreButton = main.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films.slice(shownFilmsCount, shownFilmsCount + FILM_CARDS_PER_STEP)
      .forEach((film) => render(main.querySelector('.films-list > .films-list__container'), createFilmCard(film), 'beforeend'));
    shownFilmsCount += FILM_CARDS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const extras = main.querySelectorAll('.films-list--extra > .films-list__container');
const topRated = extras[0];
const mostCommented = extras[1];

if (mostRatedFilms.length > 0) {
  for (let i = 0; i < mostRatedFilms.length; i++) {
    render(topRated, createFilmCard(mostRatedFilms[i]), 'beforeend');
  }
}

if (mostCommentedFilms.length > 0) {
  for (let i = 0; i < mostCommentedFilms.length; i++) {
    render(mostCommented, createFilmCard(mostCommentedFilms[i]), 'beforeend');
  }
}

render(footerStats, createFooterStats(), 'beforeend');

render(document.querySelector('body'), createPopup(films[0]), 'beforeend');

const popup = document.querySelector('.film-details');

render(popup.querySelector('.film-details__bottom-container'), createPopupCommentContainer(films[0]), 'beforeend');
render(popup.querySelector('.film-details__comments-list'), createPopupComment(films[0]), 'beforeend');

createLoading;
createEmptyList;
createStats;
