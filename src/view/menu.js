import AbstractView from './abstract.js';
import {FilterType, MenuItem} from '../utils/utils.js';

const createMenuElement = (filters, currentFilterType, menuItem) => {
  const watchlistCount = filters.map((filter) => {if (filter.type === FilterType.WATCHLIST) {return filter.count;}}).join('');
  const historyCount = filters.map((filter) => {if (filter.type === FilterType.HISTORY) {return filter.count;}}).join('');
  const favoritesCount = filters.map((filter) => {if (filter.type === FilterType.FAVORITES) {return filter.count;}}).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${menuItem === MenuItem.FILMS && currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${menuItem === MenuItem.FILMS && currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item ${menuItem === MenuItem.FILMS && currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item ${menuItem === MenuItem.FILMS && currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${menuItem === MenuItem.STATS ? 'main-navigation__additional--active' : ''}">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType, menuItem) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._menuItem = menuItem;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuElement(this._filters, this._currentFilter, this._menuItem);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if(!evt.target.href) {
      return;
    }
    const changedFilter = evt.target.href.split('#').pop();
    if (changedFilter.toUpperCase() === MenuItem.STATS) {
      return;
    }
    this._callback.filterTypeChange(changedFilter);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if(!evt.target.href) {
      return;
    }
    const menuItem = evt.target.href.split('#').pop();
    if (menuItem.toUpperCase() === MenuItem.STATS) {
      this._menuItem = MenuItem.STATS;
      this._callback.menuClick(MenuItem.STATS);
    } else {
      this._menuItem = MenuItem.FILMS;
      this._callback.menuClick(MenuItem.FILMS);
    }
  }
}
