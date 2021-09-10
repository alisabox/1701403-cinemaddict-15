import UserStatusView from './view/user.js';
import LoadingView from './view/loading.js';
import FooterStatsView from './view/footer-stats.js';
import StatsView from './view/stats.js';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition, MenuItem, remove} from './utils/utils.js';

import {generateFilmCards} from './mock/film-card-mock.js';

const MAX_FILM_CARDS = 20;

const films = generateFilmCards(MAX_FILM_CARDS);

const filterModel = new FilterModel();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

render(header, new UserStatusView(), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsListPresenter(main, filmsModel, filterModel);

let statsView = new StatsView(filmsModel.getFilms());

const changeStatsPeriod = (evt) => {
  remove(statsView);
  statsView = new StatsView(filmsModel.getFilms(), evt.target.value);
  render(main, statsView, RenderPosition.BEFOREEND);
  statsView.setPeriodChangeHandler(changeStatsPeriod);
};

const filterPresenter = new FilterPresenter(main, filterModel, filmsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (main.querySelector('.films')) {
        return;
      }
      remove(statsView);
      filterPresenter.init();
      filmsPresenter.init();
      break;
    case MenuItem.STATS:
      filmsPresenter.destroy();
      filterPresenter.init(MenuItem.STATS);
      statsView = new StatsView(filmsModel.getFilms());
      statsView.setPeriodChangeHandler(changeStatsPeriod);
      render(main, statsView, RenderPosition.BEFOREEND);
      break;
  }
};


filterPresenter.init();
filmsPresenter.init();
render(footerStats, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);


statsView.setPeriodChangeHandler(changeStatsPeriod);

LoadingView;

export{handleSiteMenuClick};
