import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../utils/utils.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }

  clearFilter(updateType) {
    this._notify(updateType, null);
  }
}