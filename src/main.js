import UserStatusView from './view/user.js';
import SiteMenuView from './view/menu.js';
import SortElementView from './view/sort.js';
import ShowButtonView from './view/show-button.js';
import LoadingView from './view/loading.js';
import FilmsContainerView from './view/film-container.js';
import FilmsListView from './view/film-list';
import FilmsTopRatedView from './view/film-container-top-rated.js';
import FilmsMostCommentedView from './view/film-container-most-commented.js';
import EmptyListView from './view/film-empty-list.js';
import FilmCardView from './view/film-card.js';
import FooterStatsView from './view/footer-stats.js';
import PopupView from './view/popup.js';
import PopupCommentContainer from './view/popup-comments-container.js';
import PopupComment from './view/popup-comment';
import StatsView from './view/stats.js';
import {render, remove, RenderPosition} from './view/utils.js';

import {generateFilmCards} from './mock/film-card-mock.js';
import {getMostRatedFilms, getMostCommentedFilms} from './mock/film-extras.js';

const MAX_FILM_CARDS = 20;
const FILM_CARDS_PER_STEP = 5;

const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

const films = generateFilmCards(MAX_FILM_CARDS);
const mostRatedFilms = getMostRatedFilms(films);
const mostCommentedFilms = getMostCommentedFilms(films);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');


render(header, new UserStatusView(), RenderPosition.BEFOREEND);
render(main, new SiteMenuView(films), RenderPosition.BEFOREEND);
render(main, new SortElementView(), RenderPosition.BEFOREEND);

const filmsContainer = new FilmsContainerView();
const filmsList = new FilmsListView();
const filmsTopRated = new FilmsTopRatedView();
const filmsMostCommented = new FilmsMostCommentedView();

render(main, filmsContainer, RenderPosition.BEFOREEND);

if (films.length === 0) {
  render(filmsContainer, new EmptyListView(), RenderPosition.BEFOREEND);
} else {
  render(filmsContainer, filmsList, RenderPosition.BEFOREEND);
}

const renderFilmInfo = (container, film) => {
  const filmCard = new FilmCardView(film);
  const popup = new PopupView(film);
  filmCard.setOpenPopupHandler(() => {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    render(document.querySelector('body'), popup, RenderPosition.BEFOREEND);
    render(popup.getElement().querySelector('.film-details__bottom-container'), new PopupCommentContainer(film), RenderPosition.BEFOREEND);
    if (film.comments.length > 0) {
      render(popup.getElement().querySelector('.film-details__comments-title'), new PopupComment(film), RenderPosition.AFTER);
    }
    document.querySelector('body').classList.add('hide-overflow');

    const removePopup = () => {
      remove(popup);
      document.querySelector('body').classList.remove('hide-overflow');
    };
    popup.setRemovePopupHandler(removePopup);

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(container, filmCard, RenderPosition.BEFOREEND);
};

for (let i = 0; i < Math.min(films.length, FILM_CARDS_PER_STEP); i++) {
  renderFilmInfo(filmsList.getElement().querySelector('.films-list__container'), films[i]);
}

if (films.length > FILM_CARDS_PER_STEP) {
  let shownFilmsCount = FILM_CARDS_PER_STEP;
  const showMoreButton = new ShowButtonView();
  render(filmsList, showMoreButton, RenderPosition.BEFOREEND);

  showMoreButton.setclickHandler(() => {
    films.slice(shownFilmsCount, shownFilmsCount + FILM_CARDS_PER_STEP)
      .forEach((film) => renderFilmInfo(filmsList.getElement().querySelector('.films-list__container'), film));
    shownFilmsCount += FILM_CARDS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      remove(showMoreButton);
    }
  });
}

if (mostRatedFilms && mostRatedFilms.length > 0) {
  render(filmsContainer, filmsTopRated, RenderPosition.BEFOREEND);
  for (let i = 0; i < mostRatedFilms.length; i++) {
    renderFilmInfo(filmsTopRated.getElement().querySelector('.films-list__container'), mostRatedFilms[i]);
  }
}

if (mostRatedFilms && mostCommentedFilms.length > 0) {
  render(filmsContainer, filmsMostCommented, RenderPosition.BEFOREEND);
  for (let i = 0; i < mostCommentedFilms.length; i++) {
    renderFilmInfo(filmsMostCommented.getElement().querySelector('.films-list__container'), mostCommentedFilms[i]);
  }
}

render(footerStats, new FooterStatsView(films), RenderPosition.BEFOREEND);

LoadingView;
StatsView;
