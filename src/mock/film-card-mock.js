import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const MAX_COMMENTS = 5;
const FILM_YEARS_RANGE = 50;
const MAX_FILM_DURATION = 300;

const people = [
  'Tom Ford',
  'Takeshi Kitano',
  'Morgan Freeman',
  'Keanu Reeves',
  'Arnold Schwarzenegger',
  'Linda Hamilton',
  'Sandra Bullock',
  'Carrie-Anne Moss',
];

const getRandomIndex = (min, max) => {
  if (min < 0 || max < 0) {
    return;
  } else if (min > max) {
    [min, max] = [max, min];
  }
  return Math.round(Math.random() * (max - min) + min);
};

const suffleArray = (array) => {
  const newArray = array.slice();
  for (let _i = 0; _i < newArray.length; _i++) {
    const _j = getRandomIndex(_i, newArray.length - 1);
    [newArray[_i], newArray[_j]] = [newArray[_j], newArray[_i]];
  }
  return newArray;
};

const generateFilmTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other',
  ];

  const randomIndex = getRandomIndex(0, titles.length - 1);
  return titles[randomIndex];
};

const generateFilmRating = () => {
  const ratings = [2.3, 3.2, 5.8, 6.3, 8.3, 8.9, 9.0];

  const randomIndex = getRandomIndex(0, ratings.length - 1);
  return ratings[randomIndex];
};

const generateFilmYear = () => {
  const yearsGap = getRandomIndex(0, FILM_YEARS_RANGE);
  return dayjs().subtract(yearsGap, 'year').toDate();
};

const generateFilmDuration = () => getRandomIndex(0, MAX_FILM_DURATION);

const generateFilmGenres = () => {
  const genres = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery',
  ];
  const shuffledGenres = suffleArray(genres);
  const randomIndex = getRandomIndex(1, shuffledGenres.length - 1);
  return shuffledGenres.slice(0, randomIndex);
};

const getFilmImage = () => {
  const images = [
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
  ];

  const randomIndex = getRandomIndex(0, images.length - 1);
  return images[randomIndex];
};

const generateFilmDescription = () => {
  const descriptions = [
    'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…',
    'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant\'s narrow escap…',
    'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…',
    'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…',
    'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…',
    'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Grea…',
    'John Mason (James Stewart) is a young, somewhat timid attorney in New York City. He has been doing his job well, and he has a chance of bei…',
  ];

  const randomIndex = getRandomIndex(0, descriptions.length - 1);
  return descriptions[randomIndex];
};


const generateCommentDate = () => {
  const maxDaysGap = 14;
  const daysGap = getRandomIndex(0, maxDaysGap);
  return dayjs().subtract(daysGap, 'day').toDate();
};

const generateFilmComments = () => {

  const comments = [
    {
      id: '42',
      author: 'Tim Macoveev',
      comment: 'Interesting setting and a good cast',
      date: generateCommentDate(),
      emoji: 'smile',
    },
    {
      id: '43',
      author: 'John Doe',
      comment: 'Booooooooooring',
      date: generateCommentDate(),
      emoji: 'sleeping',
    },
    {
      id: '44',
      author: 'John Doe',
      comment: 'Very very old. Meh',
      date: generateCommentDate(),
      emoji: 'puke',
    },
    {
      id: '45',
      author: 'John Doe',
      comment: 'Almost two hours? Seriously?',
      date: generateCommentDate(),
      emoji: 'angry',
    },
    {
      id: '45',
      author: 'Oscar Wilde',
      comment: 'Recommended for all. 10/10',
      date: generateCommentDate(),
      emoji: 'smile',
    },
  ];

  const shuffledComments = suffleArray(comments);
  const randomIndex = getRandomIndex(1, MAX_COMMENTS - 1);
  return shuffledComments.slice(0, randomIndex);
};

const generateDirector = () => {
  const randomIndex = getRandomIndex(0, people.length - 1);
  return people[randomIndex];
};

const generatePeople = () => {
  const shuffledPeople = suffleArray(people);
  const randomIndex = getRandomIndex(1, shuffledPeople.length - 1);
  return shuffledPeople.slice(0, randomIndex);
};

const generateCountry = () => {
  const countries = ['Russia', 'USA', 'Japan', 'France', 'Finland', 'Italy', 'Germany', 'India'];
  const randomIndex = getRandomIndex(0, countries.length - 1);
  return countries[randomIndex];
};

const generateWatchingDate = () => {
  const daysGap = 14;
  return dayjs().add(daysGap, 'day').toDate();
};

const generateAgeRating = () => {
  const ageRatings = [0, 12, 16, 18];
  return ageRatings[getRandomIndex(0, ageRatings.length - 1)];
};

const createFilmCard = () => {
  const hasComments = Boolean(getRandomIndex(0, 1));
  const comments = hasComments === false ? false : generateFilmComments();
  const watchlist = Boolean(getRandomIndex(0, 1));
  const alreadyWatched = Boolean(getRandomIndex(0, 1));
  const favorite = Boolean(getRandomIndex(0, 1));

  return {
    id: nanoid(),
    comments,
    filmInfo: {
      title: generateFilmTitle(),
      alternativeTitle: generateFilmTitle(),
      totalRating: generateFilmRating(),
      poster: getFilmImage(),
      ageRating: generateAgeRating(),
      director: generateDirector(),
      writers: generatePeople(),
      actors: generatePeople(),
      release: {
        date: generateFilmYear(),
        releaseCountry: generateCountry(),
      },
      runtime: generateFilmDuration(),
      genre: generateFilmGenres(),
      description: generateFilmDescription(),

    },
    userDetails: {
      watchlist,
      alreadyWatched,
      watchingDate: generateWatchingDate(),
      favorite,
    },
  };
};

const generateFilmCards = (count) => new Array(count).fill(null).map(() => createFilmCard());

export {generateFilmCards};
