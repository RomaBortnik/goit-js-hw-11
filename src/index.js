import { fetchPhotos } from './fetch-photos';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const inputValue = event.currentTarget.elements.searchQuery.value;

  return fetchPhotos(inputValue)
    .then(data => {
      console.log(data);
      createMarkup(data);
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
        // const countryLanguages = Object.values(languages).join(', ');
        return `<div class="photo-card"><div class="thumb">
  <img src="${largeImageURL}" alt="${tags}" loading="lazy" /> </div>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.innerHTML = markup;
}
