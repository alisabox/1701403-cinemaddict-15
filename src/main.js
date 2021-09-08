import UserStatusView from './view/user.js';
import LoadingView from './view/loading.js';
import FooterStatsView from './view/footer-stats.js';
import StatsView from './view/stats.js';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition} from './utils/utils.js';

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
const filterPresenter = new FilterPresenter(main, filterModel, filmsModel);

filterPresenter.init();
filmsPresenter.init();
render(footerStats, new FooterStatsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);

LoadingView;
StatsView;
