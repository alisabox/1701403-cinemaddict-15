import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractView from './abstract.js';
import { intervals, intervalStart } from './../utils/utils.js';
const BAR_HEIGHT = 50;

const renderChart = (chart, sortedGenres)  => (new Chart(chart, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: sortedGenres.map((item) => item[0]),
    datasets: [{
      data: sortedGenres.map((item) => item[1]),
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: BAR_HEIGHT,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
}));

const createStats = (films, topGenre, period) => {
  const watchlistCount = films.length;
  const totalDuration = films.reduce((prevValue, currValue) => prevValue + currValue.filmInfo.runtime, 0);
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${ period === intervals.ALL_TIME ? 'checked' : '' }>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${ period === intervals.TODAY ? 'checked' : '' }>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${ period === intervals.WEEK ? 'checked' : '' }>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${ period === intervals.MONTH ? 'checked' : '' }>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${ period === intervals.YEAR ? 'checked' : '' }>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${ watchlistCount } <span class="statistic__item-description">${ watchlistCount.length === 1 ? 'movie' : 'movies' }</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${ Math.floor(totalDuration / 60) } <span class="statistic__item-description">h</span> ${ totalDuration%60 } <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${ topGenre ? topGenre : '-' }</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};
export default class Stats extends AbstractView {
  constructor(films, period = intervals.ALL_TIME) {
    super();
    this._films = films;
    this._period = period;

    this._chart = null;

    this._setChart();
    this._periodChangeHandler = this._periodChangeHandler.bind(this);
  }

  getTemplate() {
    return createStats(this._filterFilms(), this._getTopGenre(), this._period);
  }

  _filterFilms() {
    if (this._period === intervals.ALL_TIME) {
      return this._films.filter((film) => film.userDetails.alreadyWatched);
    }
    return this._films.filter((film) => film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate).isBetween(intervalStart[this._period](), dayjs().toDate()));
  }

  _getGenres() {
    if (this._filterFilms().length === 0) {
      return;
    }
    const genres = [...this._filterFilms().filter((film) => film.userDetails.alreadyWatched)
      .map((film) => film.filmInfo.genre)].flat(1)
      .reduce((allGenres, genre) => {
        if (genre in allGenres) {
          allGenres[genre]++;
        }
        else {
          allGenres[genre] = 1;
        }
        return allGenres;
      }, {});
    return Object.entries(genres).sort((a, b) => b[1] - a[1]);
  }

  _getTopGenre() {
    if (this._filterFilms().length === 0) {
      return;
    }
    return this._getGenres()[0][0];
  }

  _setChart() {
    if (this._filterFilms().length === 0) {
      return;
    }

    if (this._chart !== null) {
      this._chart = null;
    }

    const chart = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(chart, this._getGenres());
  }

  setPeriodChangeHandler(callback) {
    this._callback.changePeriod = callback;
    this.getElement().querySelector('.statistic__filters').addEventListener('input', this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();
    this._callback.changePeriod(evt);
  }
}
