import FooterStatsView from './view/footer-stats.js';
import StatsView from './view/stats.js';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition, MenuItem, remove, UpdateType} from './utils/utils.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';

const AUTHORIZATION = 'Basic 5FB2054478353FD8D';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filterModel = new FilterModel();

const filmsModel = new FilmsModel();

const mainElement = document.querySelector('.main');
const footerStatsElement = document.querySelector('.footer__statistics');

const filmsPresenter = new FilmsListPresenter(mainElement, filmsModel, filterModel, apiWithProvider);

let statsView = new StatsView(filmsModel.getFilms());

const changeStatsPeriod = (evt) => {
  remove(statsView);
  statsView = new StatsView(filmsModel.getFilms(), evt.target.value);
  render(mainElement, statsView, RenderPosition.BEFOREEND);
  statsView.setPeriodChangeHandler(changeStatsPeriod);
};

const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (mainElement.querySelector('.films')) {
        return;
      }
      remove(statsView);
      filterPresenter.init();
      filmsPresenter.init();
      break;
    case MenuItem.STATS:
      filmsPresenter.destroy();
      filmsPresenter.renderUserStatus();
      filterPresenter.init(MenuItem.STATS);
      statsView = new StatsView(filmsModel.getFilms());
      statsView.setPeriodChangeHandler(changeStatsPeriod);
      render(mainElement, statsView, RenderPosition.BEFOREEND);
      break;
  }
};


filterPresenter.init();
filmsPresenter.init();


statsView.setPeriodChangeHandler(changeStatsPeriod);


apiWithProvider.getFilms().then((films) => {
  filmsModel.setFilms(UpdateType.INIT, films);
  render(footerStatsElement, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
})
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
  toast('You are back online');
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('You are offline');
});

export{handleSiteMenuClick};
