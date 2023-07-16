import Rails from "@rails/ujs";
import Turbolinks from "turbolinks";
import Swal from "sweetalert2";

Rails.start();
Turbolinks.start();

document.addEventListener('DOMContentLoaded', () => {
    const imageBoxes = document.querySelectorAll('.box');
    const imageItems = document.querySelectorAll('.image-item');
    const selectedImages = new Set(); // Keeps track of selected images
    const codeName = new Set();

    let currentIndex = 0; // Tracks the current index of the image box to be filled

    const handleClick = async (item) => {
        const imageUrl = item.querySelector('img').getAttribute('src');
        const currentCode = await getCodeName(imageUrl);
        codeName.add(currentCode); // Assign the value to the global variable

        const cost = await getCurrentCost(imageUrl);
        const power = await  getCurrentPower(imageUrl)


        const imageBox = Array.from(imageBoxes).find(
            (box, index) => index === currentIndex && !box.classList.contains('filled-box')
        );

        if (imageBox) {

            imageBox.setAttribute('data-cost', cost.cost);
            imageBox.setAttribute('data-power', power.power);

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
                    currentIndex = 0;
                    const predefinedString = '{"Cards":[{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId":"X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"},{"CardDefId": "X"}]}';
                    const predefinedObject = JSON.parse(predefinedString);
                    const codeNameArray = Array.from(codeName); // Convert set to array

                    if (codeNameArray.length !== predefinedObject.Cards.length) {
                        console.error('Size mismatch between codeNameSet and Cards array!');
                    } else {
                        const cards = predefinedObject.Cards;
                        for (let i = 0; i < cards.length; i++) {
                            const codeNameValue = codeNameArray[i].code_name;
                            cards[i].CardDefId = codeNameValue;
                        }


                    }
                    let updatedString = btoa(JSON.stringify(predefinedObject));

                    const textarea = updatedString;
                    // Show a SweetAlert popup
                    Swal.fire({
                        title: 'Deck Code',
                        text: textarea,
                        showCancelButton: false,
                        confirmButtonText: 'Copy',
                        allowOutsideClick: false,
                        preConfirm: () => {
                            navigator.clipboard.writeText(textarea);
                        }
                    });
                }

                selectedImages.add(imageUrl); // Add the selected image to the set of selected images

                // Get new random images and update the image list
                getNewRandomImages(3)
                    .then(newImages => {
                        replaceImageList(newImages);
                        attachClickEventToNewImages();
                    });

                sortAndRenderImageBoxes();

            };
        }
    };

    imageItems.forEach((item) => {
        item.addEventListener('click', () => handleClick(item));
    });


    function sortAndRenderImageBoxes() {
        const imageBoxesArray = Array.from(imageBoxes);

        // Sort the imageBoxesArray based on the data-cost and data-power attributes
        imageBoxesArray.sort((a, b) => {
            const costA = parseInt(a.getAttribute('data-cost'));
            const costB = parseInt(b.getAttribute('data-cost'));
            const powerA = parseInt(a.getAttribute('data-power'));
            const powerB = parseInt(b.getAttribute('data-power'));

            // First, sort by cost in ascending order
            if (costA !== costB) {
                return costA - costB;
            }

            // If cost is the same, sort by power in ascending order
            return powerA - powerB;
        });

        // Reorder the imageBoxes within their current parent container
        imageBoxesArray.forEach((box) => {
            box.parentNode.appendChild(box);
        });
    }


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



    function getCodeName(imageUrl) {
        return new Promise((resolve, reject) => {
            fetch('/images/get_code_name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': Rails.csrfToken()
                },
                body: JSON.stringify({ imageUrl })
            })
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    }

    function getCurrentCost(imageUrl) {
        return new Promise((resolve, reject) => {
            fetch('/images/get_current_cost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': Rails.csrfToken()
                },
                body: JSON.stringify({ imageUrl })
            })
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    }

    function getCurrentPower(imageUrl) {
        return new Promise((resolve, reject) => {
            fetch('/images/get_current_power', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': Rails.csrfToken()
                },
                body: JSON.stringify({ imageUrl })
            })
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    }

    function replaceImageList(newImages) {
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '';

        newImages.forEach((image) => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');

            const imgElement = document.createElement('img');
            if (image.url.startsWith('http')) {
                imgElement.src = image.url;
            } else {
                imgElement.src = '/assets/' + image.url;
            }
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