import AbstractView from './abstract.js';

const createFooterStats = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStats(this._films);
  }
}
