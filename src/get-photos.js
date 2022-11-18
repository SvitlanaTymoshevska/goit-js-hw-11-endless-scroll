import axios from 'axios';

class GetingPhotos { 
    constructor() { 
        this.searchQuery = '';
        this.page = 1;
        this.shownPhotos = 0;
        this.totalHits = 0;
    }
    
    async getPhotos() {
        const response = await axios({
            url: 'https://pixabay.com/api/',
            params: {
                key: '31318291-9a8be1d683ef762d4988421c4',
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: this.page,
                per_page: 40,
            }
        });
      
        const photos = response.data.hits;
        this.shownPhotos = this.shownPhotos + photos.length;
        this.totalHits = response.data.totalHits;

        if (photos.length === 0) {
            throw new Error();
        };
        if (this.shownPhotos >= this.totalHits) {
            throw new Error();
        }; 
        return photos;
    }

    increasePage() { 
        this.page += 1;
    }

    resetPage() { 
        this.page = 1;
    }

    set query(newQuery) { 
        this.searchQuery = newQuery;
    }
}

export { GetingPhotos };