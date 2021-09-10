import dayjs from 'dayjs';
import Abstract from '../view/abstract.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTER: 'after',
};

const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTER:
      container.after(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const sortByDate = (film1, film2) => (
  dayjs(film2.filmInfo.release.date).diff(film1.filmInfo.release.date)
);

const sortByRaing = (film1, film2) => (
  film2.filmInfo.totalRating - film1.filmInfo.totalRating
);

const UserAction = {
  UPDATE_STATS: 'UPDATE_STATS',
  ADD_COMMENT: 'ADD',
  DELETE_COMMENT: 'DELETE',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const MenuItem = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};

const intervals = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const intervalStart = {
  [intervals.TODAY]: () => dayjs().subtract(1, 'day').toDate(),
  [intervals.WEEK]: () => dayjs().subtract(1, 'week').toDate(),
  [intervals.MONTH]: () => dayjs().subtract(1, 'month').toDate(),
  [intervals.YEAR]: () => dayjs().subtract(1, 'year').toDate(),
};

export {RenderPosition, render, remove, createElement, FilterType, MenuItem,
  replace, SortType, sortByDate, sortByRaing, UserAction, UpdateType, intervals, intervalStart};
