const mainImage = document.querySelector('.product-main-image img');
const urlParams = new URLSearchParams(window.location.search);
const clickedId = urlParams.get('id');
// main image
if (clickedId) {
    const product = products.find(p => p.id == clickedId);
    if (product) {
        mainImage.src = product.image;
    }
}
const minorImages = document.querySelectorAll('.product-icons img');
// side images
if (clickedId) {
    const product = products.find(p => p.id == clickedId);
    if (product) {
        minorImages.forEach((img, index) => {
            // Assign the corresponding thumbnail image
            if (product.thumbnails[index]) {
                img.src = product.thumbnails[index];

                // Optional: click to update main image
                img.addEventListener('click', () => {
                    document.querySelector('.product-main-image img').src = product.thumbnails[index];
                });
            }
        });
    }
}
// angle images
const angleImages = document.querySelectorAll('.options img');
if (clickedId) {
    const product = products.find(p => p.id == clickedId);
    if (product) {
        angleImages.forEach((img, index) => {
            // Assign the corresponding thumbnail image
            if (product.side[index]) {
                img.src = product.side[index];

                // Optional: click to update main image
                img.addEventListener('click', () => {
                    document.querySelector('.product-main-image img').src = product.side[index];
                });
            }
        });
    }
}
// title 
const titles = document.querySelector('.product-d-details .product-title')
if (clickedId) {
    const product = products.find(p => p.id == clickedId);
    if (product) {
       titles.textContent = product.title;
    }
}

// product description
if (clickedId) {
  const product = products.find(p => p.id == clickedId);
  if (product && product.description) {
    const descText = product.description;        // description text from data.js
    const lines = descText.split('\n');          // split into lines
    const listItems = document.querySelectorAll('.product-description ul li'); // select all <li> under .product-description

    // fill each <li> with each line from description
    lines.forEach((line, index) => {
      if (listItems[index]) {
        listItems[index].textContent = line.trim();
      }
    });
  }
}

// hover for angle images 
const optionDivs = document.querySelectorAll('.product-color-options .options');
optionDivs.forEach(div => {
  div.addEventListener('click', () => {
    // Reset all divs
    optionDivs.forEach(d => {
      d.style.border = '1px solid #ccc';
      d.style.boxShadow = 'none';
      d.style.borderRadius = '6px';
    });

    // Highlight clicked div (no background color)
    div.style.border = '2px solid #000';
    div.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
    div.style.borderRadius = '8px';
  });
});

// hover effect for side images 
const iconImages = document.querySelectorAll('.product-icons img');
iconImages.forEach(img => {
  img.addEventListener('click', () => {
    // Reset all
    iconImages.forEach(i => {
      i.style.border = '1px solid #ccc';
      i.style.boxShadow = 'none';
      i.style.borderRadius = '6px';
    });

    // Highlight clicked
    img.style.border = '2px solid #000';
    img.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
    img.style.borderRadius = '8px';
  });
});































