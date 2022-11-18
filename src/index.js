import { GetingPhotos } from './get-photos';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchFormEl: document.querySelector('#search-form'),
    galleryEl: document.querySelector('.gallery'),
    loadMoreWrapper: document.querySelector('.load-more-wrapper'),
    loadMore: document.querySelector('.load-more'),   
}
const getingPhotos = new GetingPhotos();
let lightbox;

refs.searchFormEl.addEventListener('submit', onSubmit);
refs.galleryEl.addEventListener('click', onImgClick);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSubmit(e) { 
    e.preventDefault();

    if (refs.galleryEl.firstElementChild) {
        clearGallery();
        refs.loadMoreWrapper.classList.add('is-hidden');
        getingPhotos.resetPage();
    }

    getingPhotos.query = e.target.searchQuery.value;  
    try {
        const photos = await getingPhotos.getPhotos();
        
        makeGalleryMarkup(photos);
        getingPhotos.increasePage();
        Notify.info(`Hooray! We found ${getingPhotos.totalHits} images.`); 
        lightbox = new SimpleLightbox('.gallery a');
        refs.loadMoreWrapper.classList.remove('is-hidden');
    }
    catch {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }  
}

async function onLoadMore(e) {
    try {
        const photos = await getingPhotos.getPhotos();

        makeGalleryMarkup(photos);
        getingPhotos.increasePage();
        lightbox.refresh();
        smoothScrolling();
    }
    catch {
        Notify.failure("We're sorry, but you've reached the end of search results.");
        refs.loadMoreWrapper.classList.add('is-hidden');
    }
}

function makeGalleryMarkup(photos) {  
    refs.galleryEl.insertAdjacentHTML('beforeend', photos.map(el => { 
        const { webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads } = el;

        const cardEl = `<a class="photo-card" href="${largeImageURL}">
                        <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy"/>
                        
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </div>
                    </a>`;
        return cardEl;
    }).join(''));
}

function onImgClick(e) {
    e.preventDefault();
    
    if (e.target.nodeName !== 'IMG') {
        return;
    };

    lightbox.open(e);  
}

function clearGallery() { 
    refs.galleryEl.innerHTML = '';
}

function smoothScrolling() { 
    const { height: cardHeight } = refs.galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}