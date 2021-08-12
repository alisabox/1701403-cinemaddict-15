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
import {renderElement, RenderPosition} from './view/utils.js';

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


renderElement(header, new UserStatusView().getElement(), RenderPosition.BEFOREEND);
renderElement(main, new SiteMenuView(films).getElement(), RenderPosition.BEFOREEND);
renderElement(main, new SortElementView().getElement(), RenderPosition.BEFOREEND);

const filmsContainer = new FilmsContainerView();
const filmsList = new FilmsListView();
const filmsTopRated = new FilmsTopRatedView();
const filmsMostCommented = new FilmsMostCommentedView();

renderElement(main, filmsContainer.getElement(), RenderPosition.BEFOREEND);

if (films.length === 0) {
  renderElement(filmsContainer.getElement(), new EmptyListView().getElement(), RenderPosition.BEFOREEND);
} else {
  renderElement(filmsContainer.getElement(), filmsList.getElement(), RenderPosition.BEFOREEND);
}

const renderFilmInfo = (container, film) => {
  const filmCard = new FilmCardView(film);
  const popup = new PopupView(film);
  const renderPopup = () => {
    renderElement(document.querySelector('body'), popup.getElement(), RenderPosition.BEFOREEND);
    renderElement(popup.getElement().querySelector('.film-details__bottom-container'), new PopupCommentContainer(film).getElement(), RenderPosition.BEFOREEND);
    if (film.comments.length > 0) {
      renderElement(popup.getElement().querySelector('.film-details__comments-title'), new PopupComment(film).getElement(), RenderPosition.AFTER);
    }
    document.querySelector('body').classList.add('hide-overflow');

    const removePopup = () => {
      popup.getElement().remove();
      popup.removeElement();
      document.querySelector('body').classList.remove('hide-overflow');
    };
    popup.getElement().querySelector('.film-details__close-btn').addEventListener('click', removePopup);

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    document.addEventListener('keydown', onEscKeyDown);
  };

  filmCard.getElement().querySelector('.film-card__poster').addEventListener('click', renderPopup);
  filmCard.getElement().querySelector('.film-card__title').addEventListener('click', renderPopup);
  filmCard.getElement().querySelector('.film-card__comments').addEventListener('click', renderPopup);

  renderElement(container, filmCard.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < Math.min(films.length, FILM_CARDS_PER_STEP); i++) {
  renderFilmInfo(filmsList.getElement().querySelector('.films-list__container'), films[i]);
}

if (films.length > FILM_CARDS_PER_STEP) {
  let shownFilmsCount = FILM_CARDS_PER_STEP;
  const showMoreButton = new ShowButtonView();
  renderElement(filmsList.getElement(), showMoreButton.getElement(), RenderPosition.BEFOREEND);

  showMoreButton.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films.slice(shownFilmsCount, shownFilmsCount + FILM_CARDS_PER_STEP)
      .forEach((film) => renderFilmInfo(filmsList.getElement().querySelector('.films-list__container'), film));
    shownFilmsCount += FILM_CARDS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      showMoreButton.getElement().remove();
    }
  });
}

if (mostRatedFilms && mostRatedFilms.length > 0) {
  renderElement(filmsContainer.getElement(), filmsTopRated.getElement(), RenderPosition.BEFOREEND);
  for (let i = 0; i < mostRatedFilms.length; i++) {
    renderFilmInfo(filmsTopRated.getElement().querySelector('.films-list__container'), mostRatedFilms[i]);
  }
}

if (mostRatedFilms && mostCommentedFilms.length > 0) {
  renderElement(filmsContainer.getElement(), filmsMostCommented.getElement(), RenderPosition.BEFOREEND);
  for (let i = 0; i < mostCommentedFilms.length; i++) {
    renderFilmInfo(filmsMostCommented.getElement().querySelector('.films-list__container'), mostCommentedFilms[i]);
  }
}

renderElement(footerStats, new FooterStatsView(films).getElement(), RenderPosition.BEFOREEND);

LoadingView;
StatsView;
