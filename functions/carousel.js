'use strict';

const {
    Image,
    BrowseCarousel,
    BrowseCarouselItem,
} = require('actions-on-google');

const mediumStoryBaseUrl = 'https://medium.com/p/';
const articlesJson = require('./articles');

/**
 * Searches Article Tags for the text searched.
 * @param {string} queryText
 * @return {Array} searchResult
 */
function searchTags(queryText) {
    let searchResult = [];
    let itemList = articlesJson.bookmarks;
    for (let key in itemList) {
        if (itemList.hasOwnProperty(key)) {
            const item = itemList[key];
            if (item.tags != undefined) {
                for (let i = 0; i < item.tags.length; i++) {
                    let tag = item.tags[i].toLowerCase();
                    if (tag.includes(queryText.toLowerCase())) {
                        console.log(tag);
                        searchResult.push(item);
                        break;
                    }
                }
            }
        }
    }

    return searchResult;
}

/**
 * Maps fields from Data search to Carousel items.
 * @param {Object} searchResultItem
 * @return {BrowseCarouselItem}
 */
function mapFields(searchResultItem) {
    return {
        'title': searchResultItem.title,
        'description': searchResultItem.subtitle,
        'footer': searchResultItem.readingTime,
        'url': mediumStoryBaseUrl + searchResultItem.postId,
        'image': new Image({
            'url': searchResultItem.image,
            'alt': searchResultItem.title,
        }),
    };
}

/**
 * Creates Carousel from Search results.
 * @param {Array} searchResult
 * @return {BrowseCarousel}
 */
function createSearchResultCarousel(searchResult) {
    let items = [];
    let carouselItem;
    for (let key in searchResult) {
        if (searchResult.hasOwnProperty(key)) {
            const searchResultItem = searchResult[key];
            const carouselItemOptions = mapFields(searchResultItem);
            carouselItem = new BrowseCarouselItem(carouselItemOptions);
            items.push(carouselItem);
        }
    }

    let carousel = new BrowseCarousel({
        'items': items,
    });
    return carousel;
}

/**
 * Creates carousel.
 * @param {string} topic
 * @return {BrowseCarousel}
 */
function createCarousel(topic) {
    let searchResult = searchTags(topic);
    return createSearchResultCarousel(searchResult);
}

module.exports.createCarousel = createCarousel;
