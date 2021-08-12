import { createElement } from './utils';

const createFooterStats = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class FooterStats {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStats(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
