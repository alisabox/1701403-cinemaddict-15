import UserStatusView from './view/user.js';
import LoadingView from './view/loading.js';
import FooterStatsView from './view/footer-stats.js';
import StatsView from './view/stats.js';
import FilmsListPresenter from './presenter/films-list-presenter';
import {render, RenderPosition} from './view/utils.js';

import {generateFilmCards} from './mock/film-card-mock.js';

const MAX_FILM_CARDS = 20;

const films = generateFilmCards(MAX_FILM_CARDS);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');


render(header, new UserStatusView(), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsListPresenter(main);
filmsPresenter.init(films);
render(footerStats, new FooterStatsView(films), RenderPosition.BEFOREEND);

LoadingView;
StatsView;
