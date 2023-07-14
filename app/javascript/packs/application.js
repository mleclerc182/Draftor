import Rails from "@rails/ujs";
import Turbolinks from "turbolinks";
import Swal from "sweetalert2";

Rails.start();
Turbolinks.start();




document.addEventListener('DOMContentLoaded', () => {
    let assignedVariable;
    const imageBoxes = document.querySelectorAll('.box');
    const imageItems = document.querySelectorAll('.image-item');
    const selectedImages = new Set(); // Keeps track of selected images

    let currentIndex = 0; // Tracks the current index of the image box to be filled

    const handleClick = async (item) => {
        const imageUrl = item.querySelector('img').getAttribute('src');

        const imageBox = Array.from(imageBoxes).find((box, index) => index === currentIndex && !box.classList.contains('filled-box'));

        const testPromise = testMethod();
        testPromise
            .then((testValue) => {
                assignedVariable = testValue; // Assign the value to the global variable
                console.log('Assigned Variable:', assignedVariable);
            })
            .catch((error) => {
                console.error(error);
            });


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
                   currentIndex = 0;
                    console.log(selectedImages)
                    const  textarea = "sfdsdfsdfsfasa"
                    // Show a SweetAlert popup
                    Swal.fire({
                        title: 'Deck Code',
                        html: '<textarea id="popup-textarea" readonly>' + textarea + '</textarea>',
                        showCancelButton: true,
                        confirmButtonText: 'Copy',
                        cancelButtonText: 'Close',
                        allowOutsideClick: false,

                        preConfirm: () => {
                           navigator.clipboard.writeText(textarea)
                            Swal.fire({
                                title: 'Text copied to clipboard!',
                                html: '<textarea id="popup-textarea" readonly>' + textarea + '</textarea>',
                                showCancelButton: false,
                                allowOutsideClick: false
                            });
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
                console.log("ASSIGNEDVARIABLE", assignedVariable)
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
    function testMethod() {
        return new Promise((resolve, reject) => {
            fetch('/images/test_method', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': Rails.csrfToken()
                }
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

