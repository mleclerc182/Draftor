import Rails from "@rails/ujs";
import Turbolinks from "turbolinks";

Rails.start();
Turbolinks.start();

document.addEventListener('DOMContentLoaded', () => {
    const imageBoxes = document.querySelectorAll('.box');
    const imageItems = document.querySelectorAll('.image-item');
    const selectedImages = new Set(); // Keeps track of selected images

    let currentIndex = 0; // Tracks the current index of the image box to be filled

    const handleClick = async (item) => {
        const imageUrl = item.querySelector('img').getAttribute('src');

        const imageBox = Array.from(imageBoxes).find((box, index) => index === currentIndex && !box.classList.contains('filled-box'));

        if (imageBox) {
            const image = new Image();
            image.src = imageUrl;
            image.onload = () => {
                imageBox.innerHTML = '';
                imageBox.style.backgroundImage = 'none';
                imageBox.classList.add('filled-box');
                item.style.display = 'none';

                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.classList.add('filled-image');
                imageBox.appendChild(imgElement);

                currentIndex++; // Increment the current index to move to the next image box

                if (currentIndex === imageBoxes.length) {
                    // If all image boxes are filled, reset the current index to 0
                    currentIndex = 0;
                }

                selectedImages.add(imageUrl); // Add the selected image to the set of selected images

                // Get new random images and update the image list
                getNewRandomImages(3)
                    .then(newImages => {
                        replaceImageList(newImages);
                        attachClickEventToNewImages();
                    });
            };
        }
    };

    imageItems.forEach((item) => {
        item.addEventListener('click', () => handleClick(item));
    });

    async function getNewRandomImages(count) {
        try {
            const response = await fetch('/images/get_random_images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': Rails.csrfToken()
                },
                body: JSON.stringify({ count, selectedImages: Array.from(selectedImages) })
            });

            const data = await response.json();
            return data.images;
        } catch (error) {
            console.error(error);
        }
    }

    function replaceImageList(newImages) {
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '';

        newImages.forEach((image) => {

            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');

            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = 'Image';
            imageItem.appendChild(imgElement);

            imageList.appendChild(imageItem);

        });
    }

    function attachClickEventToNewImages() {
        const newImageItems = document.querySelectorAll('.image-item:not(.filled-item)');

        newImageItems.forEach((item) => {
            item.addEventListener('click', () => handleClick(item));
        });
    }


});