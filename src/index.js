import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import InfiniteScroll from 'infinite-scroll';
// import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';
import { fetchPhotos } from './fetch-photos';
export let countOfPage = 1;
export let countPerPage = 40;

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadButton = document.querySelector('.gallery__load-button');

let inputDefaultValue = null;
let totalHits = null;

const lightbox = new SimpleLightbox('.gallery__link', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', onFormSubmit);
loadButton.addEventListener('click', onLoadButtonClick);

function onFormSubmit(event) {
  event.preventDefault();

  const inputValue = event.currentTarget.elements.searchQuery.value;
  if (inputDefaultValue === inputValue) {
    return;
  }
  inputDefaultValue = inputValue;
  makeInitialValues();

  fetchPhotos(inputValue)
    .then(data => {
      console.log(data);
      if (data.totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      createMarkup(data);
      lightbox.refresh();

      if (data.totalHits > countPerPage) {
        loadButton.classList.remove('visually-hidden');
        updateSearchParams(data);
      }
    })
    .catch(error => console.log(error));
}

function onLoadButtonClick(event) {
  fetchPhotos(inputDefaultValue)
    .then(data => {
      console.log(data);

      createMarkup(data);
      lightbox.refresh();
      updateSearchParams(data);

      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      console.log(gallery.firstElementChild.getBoundingClientRect());

      if (totalHits === data.totalHits) {
        loadButton.classList.add('visually-hidden');
        return Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

function createMarkup(params) {
  const markup = params.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="gallery__photo-card">
        <a class = "gallery__link" href = ${largeImageURL}><div class="gallery__thumb">
        <img src=${webformatURL} alt="${tags}" loading="lazy" />
   </div>
  <div class="gallery__info">
    <p class="gallery__info-item">
      <b>Likes:</b>${likes}
    </p>
    <p class="gallery__info-item">
      <b>Views:</b>${views}
    </p>
    <p class="gallery__info-item">
      <b>Comments:</b>${comments}
    </p>
    <p class="gallery__info-item">
      <b>Downloads:</b>${downloads}
    </p>
  </div>
  </a>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function makeInitialValues() {
  loadButton.classList.add('visually-hidden');
  gallery.innerHTML = '';
  countOfPage = 1;
  totalHits = null;
}

function updateSearchParams(value) {
  totalHits += value.hits.length;
  countOfPage += 1;
}
