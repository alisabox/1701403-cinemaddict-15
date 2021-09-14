import UserStatusView from './view/user.js';
import FooterStatsView from './view/footer-stats.js';
import StatsView from './view/stats.js';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition, MenuItem, remove, UpdateType} from './utils/utils.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 5FB2054478353FD8D';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();

const filmsModel = new FilmsModel();

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

render(header, new UserStatusView(), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsListPresenter(main, filmsModel, filterModel, api);

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


statsView.setPeriodChangeHandler(changeStatsPeriod);


api.getFilms().then((films) => {
  filmsModel.setFilms(UpdateType.INIT, films);
  render(footerStats, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
})
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

export{handleSiteMenuClick};
