import SiteMenuView from '../view/menu.js';
import SortElementView from '../view/sort.js';
import ShowButtonView from '../view/show-button.js';
import FilmsContainerView from '../view/film-container.js';
import FilmsListView from '../view/film-list';
import FilmsTopRatedView from '../view/film-container-top-rated.js';
import FilmsMostCommentedView from '../view/film-container-most-commented.js';
import EmptyListView from '../view/film-empty-list.js';
import { render, remove, RenderPosition, updateItem, SortType, sortByDate, sortByRaing } from '../view/utils.js';
import { getMostRatedFilms, getMostCommentedFilms } from '../mock/film-extras.js';

import FilmPresenter from './film-presenter.js';

const FILM_CARDS_PER_STEP = 5;

export default class FilmsList {
  constructor(pageContainer) {
    this._container = pageContainer;
    this._shownFilmsCount = FILM_CARDS_PER_STEP;
    this._filmsPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._emptyList = new EmptyListView();
    this._filmsContainer = new FilmsContainerView();
    this._filmsList = new FilmsListView();
    this._filmsTopRated = new FilmsTopRatedView();
    this._filmsMostCommented = new FilmsMostCommentedView();
    this._showMoreButton = new ShowButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = this._films.slice();

    this._mostRatedFilms = getMostRatedFilms(this._films);
    this._mostCommentedFilms = getMostCommentedFilms(this._films);

    this._siteMenu = new SiteMenuView(this._films);
    this._renderSiteMenu();
    this._renderSort();

    render(this._container, this._filmsContainer, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._filmsPresenter.get(updatedFilm.id).init(updatedFilm);
    this._renderChangedSiteMenu();
  }

  _renderSiteMenu() {
    render(this._container, this._siteMenu, RenderPosition.BEFOREEND);
  }

  _renderChangedSiteMenu() {
    remove(this._siteMenu);
    this._siteMenu = new SiteMenuView(this._films);
    render(this._container, this._siteMenu, RenderPosition.AFTERBEGIN);
  }

  _renderFilmsListContainer() {
    render(this._filmsContainer, this._filmsList, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._filmsContainer, this._emptyList, RenderPosition.BEFOREEND);
  }

  _renderFilmsList(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmInfo(this._filmsList.getElement().querySelector('.films-list__container'), film));
  }

  _renderFilmsTopRated() {
    if (this._mostRatedFilms && this._mostRatedFilms.length > 0) {
      render(this._filmsContainer, this._filmsTopRated, RenderPosition.BEFOREEND);
      this._mostRatedFilms
        .forEach((film) => this._renderFilmInfo(this._filmsTopRated.getElement().querySelector('.films-list__container'), film));
    }
  }

  _renderFilmsMostCommented() {
    if (this._mostCommentedFilms && this._mostCommentedFilms.length > 0) {
      render(this._filmsContainer, this._filmsMostCommented, RenderPosition.BEFOREEND);
      this._mostCommentedFilms
        .forEach((film) => this._renderFilmInfo(this._filmsMostCommented.getElement().querySelector('.films-list__container'), film));
    }
  }

  _renderFilmInfo(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange);
    filmPresenter.init(film);
    this._filmsPresenter.set(film.id, filmPresenter);
  }

  _clearFilmsList() {
    remove(this._sortElement);
    remove(this._filmsList);
    remove(this._showMoreButton);
    remove(this._filmsTopRated);
    remove(this._filmsMostCommented);
    this._shownFilmsCount = FILM_CARDS_PER_STEP;
    this._filmsPresenter.clear();
  }

  _handleShowMoreButtonClick() {
    this._films
      .slice(this._shownFilmsCount, this._shownFilmsCount + FILM_CARDS_PER_STEP)
      .forEach((film) => this._renderFilmInfo(this._filmsList.getElement().querySelector('.films-list__container'), film));

    this._shownFilmsCount += FILM_CARDS_PER_STEP;

    if (this._shownFilmsCount >= this._films.length) {
      remove(this._showMoreButton);
    }

  }

  _renderShowMoreButton() {
    render(this._filmsList, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderListContainer() {
    this._renderFilmsList(0, Math.min(this._films.length, FILM_CARDS_PER_STEP));

    if (this._films.length > FILM_CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {
    if (this._films.length === 0) {
      this._renderEmptyList();
      return;
    }

    this._renderFilmsListContainer();
    this._renderListContainer();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }

  _renderSort() {
    this._sortElement = new SortElementView(this._currentSortType);
    render(this._container.querySelector('.main-navigation'), this._sortElement, RenderPosition.AFTER);
    this._sortElement.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderSort();
    this._renderBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortByRaing);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }
}
