import SortElementView from '../view/sort.js';
import ShowButtonView from '../view/show-button.js';
import FilmsContainerView from '../view/film-container.js';
import FilmsListView from '../view/film-list';
import FilmsTopRatedView from '../view/film-container-top-rated.js';
import FilmsMostCommentedView from '../view/film-container-most-commented.js';
import EmptyListView from '../view/film-empty-list.js';
import { render, remove, RenderPosition, SortType, sortByDate, sortByRaing, UpdateType, UserAction, FilterType } from '../utils/utils.js';
import {filter} from '../utils/filter.js';

import FilmPresenter from './film-presenter.js';

const FILM_CARDS_PER_STEP = 5;

export default class FilmsList {
  constructor(pageContainer, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._container = pageContainer;
    this._shownFilmsCount = FILM_CARDS_PER_STEP;
    this._filmsPresenter = new Map();
    this._filmsTopRatedPresenter = new Map();
    this._filmsMostCommentedPresenter = new Map();

    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;

    this._filmsContainer = new FilmsContainerView();
    this._filmsList = new FilmsListView();
    this._filmsTopRated = new FilmsTopRatedView();
    this._filmsMostCommented = new FilmsMostCommentedView();

    this._showMoreButton = null;
    this._sortElement = null;
    this._emptyList = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSort();
    render(this._container, this._filmsContainer, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRaing);
    }
    return filtredFilms;
  }

  _getTopRatedFilms() {
    return this._filmsModel.getTopRatedFilms();
  }

  _getMostCommentedFilms() {
    return this._filmsModel.getMostCommentedFilms();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_STATS:
        this._filmsModel.update(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.update(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.update(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmsPresenter.has(film.id)) {
          this._filmsPresenter.get(film.id).init(film);
        }
        if (this._filmsTopRatedPresenter.has(film.id)) {
          this._filmsTopRatedPresenter.get(film.id).init(film);
        }
        if (this._filmsMostCommentedPresenter.has(film.id)) {
          this._filmsMostCommentedPresenter.get(film.id).init(film);
        }
        break;
      case UpdateType.MINOR:
        if (this._filmsPresenter.has(film.id)) {
          this._filmsPresenter.get(film.id).init(film);
        }
        if (this._filmsTopRatedPresenter.has(film.id)) {
          this._filmsTopRatedPresenter.get(film.id).init(film);
        }
        if (this._filmsMostCommentedPresenter.has(film.id)) {
          this._filmsMostCommentedPresenter.get(film.id).init(film);
        }
        this._clearFilmsList();
        this._renderSort();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderSort();
        this._renderBoard();
        break;
    }
  }

  _renderSiteMenu() {
    render(this._container, this._siteMenu, RenderPosition.BEFOREEND);
  }

  _renderFilmsListContainer() {
    render(this._filmsContainer, this._filmsList, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    this._emptyList = new EmptyListView(this._filterType);
    render(this._filmsContainer, this._emptyList, RenderPosition.BEFOREEND);
  }

  _renderFilmsList(films) {
    films.forEach((film) => this._renderFilmInfo(this._filmsList.getElement().querySelector('.films-list__container'), film));
  }

  _renderFilmsTopRated() {
    if (this._getTopRatedFilms() && this._getTopRatedFilms().length > 0) {
      render(this._filmsContainer, this._filmsTopRated, RenderPosition.BEFOREEND);
      this._getTopRatedFilms()
        .forEach((film) => this._renderTopRatedFilmInfo(this._filmsTopRated.getElement().querySelector('.films-list__container'), film));
    }
  }

  _renderFilmsMostCommented() {
    if (this._getMostCommentedFilms() && this._getMostCommentedFilms().length > 0) {
      render(this._filmsContainer, this._filmsMostCommented, RenderPosition.BEFOREEND);
      this._getMostCommentedFilms()
        .forEach((film) => this._renderMostCommentedFilmInfo(this._filmsMostCommented.getElement().querySelector('.films-list__container'), film));
    }
  }

  _renderFilmInfo(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModelEvent);
    filmPresenter.init(film);
    this._filmsPresenter.set(film.id, filmPresenter);
  }

  _renderTopRatedFilmInfo(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModelEvent);
    filmPresenter.init(film);
    this._filmsTopRatedPresenter.set(film.id, filmPresenter);
  }

  _renderMostCommentedFilmInfo(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModelEvent);
    filmPresenter.init(film);
    this._filmsMostCommentedPresenter.set(film.id, filmPresenter);
  }

  _clearFilmsList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    this._filmsPresenter.clear();

    remove(this._sortElement);
    remove(this._filmsList);
    remove(this._showMoreButton);
    remove(this._filmsTopRated);
    remove(this._filmsMostCommented);

    if (resetRenderedFilmsCount) {
      this._shownFilmsCount = FILM_CARDS_PER_STEP;
    } else {
      this._shownFilmsCount = Math.min(filmsCount, this._shownFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newShownFilmsCount = Math.min(filmsCount, this._shownFilmsCount + FILM_CARDS_PER_STEP);
    const films = this._getFilms().slice(this._shownFilmsCount, newShownFilmsCount);
    films.forEach((film) => this._renderFilmInfo(this._filmsList.getElement().querySelector('.films-list__container'), film));

    this._shownFilmsCount = newShownFilmsCount;

    if (this._shownFilmsCount >= filmsCount) {
      remove(this._showMoreButton);
    }

  }

  _renderShowMoreButton() {
    if (this._showMoreButton !== null) {
      this._showMoreButton = null;
    }
    this._showMoreButton = new ShowButtonView();
    render(this._filmsList, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderListContainer() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FILM_CARDS_PER_STEP));

    this._renderFilmsList(films);

    if (filmsCount > FILM_CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {
    const filmsCount = this._getFilms().length;

    if (filmsCount === 0) {
      this._renderEmptyList();
      return;
    }

    if (this._emptyList) {
      remove(this._emptyList);
    }

    this._renderFilmsListContainer();
    this._renderListContainer();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }

  _renderSort() {
    if (this._sortElement !== null) {
      this._sortElement = null;
    }

    this._sortElement = new SortElementView(this._currentSortType);
    render(this._container.querySelector('.main-navigation'), this._sortElement, RenderPosition.AFTER);
    this._sortElement.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderSort();
    this._renderBoard();
  }
}
