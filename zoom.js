//  Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeZoom, 1000);
});

function initializeZoom() {
    console.log('🔄 Initializing Amazon-like zoom...');
    
    // Select the main image container and image
    const mainImgContainer = document.querySelector('.product-main-image');
    if (!mainImgContainer) {
        console.error('❌ Could not find .product-main-image container');
        return;
    }
    
    const mainImg = mainImgContainer.querySelector('img');
    
    if (!mainImg) {
        console.error('❌ Could not find image inside .product-main-image');
        return;
    }
    
    console.log('✅ Found main image:', mainImg.src);

    // Create zoom window
    const zoomWindow = document.createElement('div');
    zoomWindow.id = 'amazon-zoom-window';
    Object.assign(zoomWindow.style, {
        position: 'fixed',
        border: '1px solid #d5d9d9',
        overflow: 'hidden',
        display: 'none',
        zIndex: '9999',
        backgroundColor: '#000',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        borderRadius: '4px',
        pointerEvents: 'none',
        width: '750px',
        height: '400px'
    });
    document.body.appendChild(zoomWindow);

    // Create magnified image inside zoom window
    const zoomImg = document.createElement('img');
    zoomImg.src = mainImg.src;
    Object.assign(zoomImg.style, {
        position: 'absolute',
        top: '0',
        left: '0'
    });
    zoomWindow.appendChild(zoomImg);

    // Create hover lens (light black transparent box) WITH + ICON
    const hoverLens = document.createElement('div');
    hoverLens.id = 'amazon-zoom-lens';
    Object.assign(hoverLens.style, {
        position: 'absolute',
        border: '1px solid rgba(255, 255, 255, 0.6)', // Light border
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Light black transparent
        display: 'none',
        zIndex: '100',
        pointerEvents: 'none',
        boxSizing: 'border-box'
    });
    
    mainImgContainer.appendChild(hoverLens);

    // Lens size - width double than height
    const lensHeightPercent = 0.20; // 20% of image height
    const lensWidthPercent = lensHeightPercent * 2; // Width is double the height (40% of image width)

    let isMouseOver = false;

    // Mouse enter - show lens and zoom window
    mainImgContainer.addEventListener('mouseenter', function(e) {
        isMouseOver = true;
        updateZoomPosition(e);
    });

    // Mouse move - update position
    mainImgContainer.addEventListener('mousemove', function(e) {
        if (!isMouseOver) return;
        updateZoomPosition(e);
    });

    // Mouse leave - hide everything
    mainImgContainer.addEventListener('mouseleave', function() {
        isMouseOver = false;
        zoomWindow.style.display = 'none';
        hoverLens.style.display = 'none';
    });

    function updateZoomPosition(e) {
        const rect = mainImg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate lens size - width double than height
        const lensWidth = rect.width * lensWidthPercent;
        const lensHeight = rect.height * lensHeightPercent;
        
        // Position lens centered on mouse
        let lensLeft = mouseX - (lensWidth / 2);
        let lensTop = mouseY - (lensHeight / 2);

        // Keep lens within image boundaries
        // lensLeft = Math.max(0, Math.min(lensLeft, rect.width - lensWidth));
        // lensTop = Math.max(0, Math.min(lensTop, rect.height - lensHeight));
// Allow lens center (+) to reach edges
lensLeft = Math.max(-(lensWidth / 2), Math.min(lensLeft, rect.width - (lensWidth / 2)));
lensTop = Math.max(-(lensHeight / 2), Math.min(lensTop, rect.height - (lensHeight / 2)));
        // Update lens position
        hoverLens.style.width = lensWidth + 'px';
        hoverLens.style.height = lensHeight + 'px';
        hoverLens.style.left = lensLeft + 'px';
        hoverLens.style.top = lensTop + 'px';
        hoverLens.style.display = 'block';

        // Position zoom window to the right of image
        zoomWindow.style.left = (rect.right + 20) + 'px';
        zoomWindow.style.top = rect.top + 'px';
        zoomWindow.style.display = 'block';

        // Calculate zoom (2x magnification)
        const zoomLevel = 2;
        zoomImg.style.width = (mainImg.naturalWidth * zoomLevel) + 'px';
        zoomImg.style.height = (mainImg.naturalHeight * zoomLevel) + 'px';

        // Calculate zoom image position based on lens center
        const lensCenterX = lensLeft + (lensWidth / 2);
        const lensCenterY = lensTop + (lensHeight / 2);
        
        const xPercent = lensCenterX / rect.width;
        const yPercent = lensCenterY / rect.height;

        const zoomImgWidth = parseInt(zoomImg.style.width);
        const zoomImgHeight = parseInt(zoomImg.style.height);

        zoomImg.style.left = -xPercent * (zoomImgWidth - 750) + 'px';
        zoomImg.style.top = -yPercent * (zoomImgHeight - 400) + 'px';
    }

    // Update when main image changes
    mainImg.addEventListener('load', function() {
        zoomImg.src = mainImg.src;
    });

    // Handle scroll
    window.addEventListener('scroll', function() {
        if (isMouseOver) {
            zoomWindow.style.display = 'none';
            hoverLens.style.display = 'none';
        }
    });

    // Add CSS styles WITH LARGER AND THINNER WHITE + ICON
    const style = document.createElement('style');
    style.textContent = `
        /* Zoom window with black background */
        #amazon-zoom-window {
            background: #000 !important;
            border: 1px solid #d5d9d9 !important;
        }
        
        /* Hover lens - light black transparent box */
        #amazon-zoom-lens {
            border: 1px solid rgba(255, 255, 255, 0.6) !important;
            background: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(0.5px);
        }
        
        /* LARGER AND THINNER WHITE + ICON */
        #amazon-zoom-lens::before {
            content: "+";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white !important;
            font-size: 35px !important; /* Increased size */
            font-weight: 50 !important; /* Thin weight (normal is 400, bold is 700) */
            text-shadow: 0 0 3px #000;
            pointer-events: none;
            z-index: 101;
        }
        /* Change cursor to pointer */
        // .product-main-image {
        //     position: relative !important;
        //     cursor: pointer !important;
        // }
       /* Ensure the lens can go outside but is clipped by the container */
       .product-main-image {
        position: relative !important;
        overflow: hidden !important;    /* <-- ADD THIS LINE */
        cursor: pointer !important;
        }  
        /* Remove any fade effects */
        .product-main-image::after {
            display: none !important;
        }
        
        .product-main-image img {
            opacity: 1 !important;
        }
        
        /* Hide on mobile */
        @media (max-width: 768px) {
            #amazon-zoom-window,
            #amazon-zoom-lens {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Amazon zoom initialized successfully - With larger thin white + icon');
}

// Fallback initialization
setTimeout(function() {
    if (!document.getElementById('amazon-zoom-window')) {
        console.log('🔄 Fallback initialization...');
        initializeZoom();
    }
}, 2000);


// this one is for scroll i mean when i scroll the zoomwindow always be in the right centre of the viewport 

// //  Wait for the page to fully load
// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(initializeZoom, 1000);
// });

// function initializeZoom() {
//     console.log('🔄 Initializing Amazon-like zoom...');
    
//     // Select the main image container and image
//     const mainImgContainer = document.querySelector('.product-main-image');
    
//     if (!mainImgContainer) {
//         console.error('❌ Could not find .product-main-image container');
//         return;
//     }
    
//     const mainImg = mainImgContainer.querySelector('img');
    
//     if (!mainImg) {
//         console.error('❌ Could not find image inside .product-main-image');
//         return;
//     }
    
//     console.log('✅ Found main image:', mainImg.src);

//     // Create zoom window
//     const zoomWindow = document.createElement('div');
//     zoomWindow.id = 'amazon-zoom-window';
//     Object.assign(zoomWindow.style, {
//         position: 'fixed',
//         border: '1px solid #d5d9d9',
//         overflow: 'hidden',
//         display: 'none',
//         zIndex: '9999',
//         backgroundColor: '#000',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
//         borderRadius: '4px',
//         pointerEvents: 'none',
//         width: '750px',
//         height: '400px'
//     });
//     document.body.appendChild(zoomWindow);

//     // Create magnified image inside zoom window
//     const zoomImg = document.createElement('img');
//     zoomImg.src = mainImg.src;
//     Object.assign(zoomImg.style, {
//         position: 'absolute',
//         top: '0',
//         left: '0'
//     });
//     zoomWindow.appendChild(zoomImg);

//     // Create hover lens (light black transparent box) WITH + ICON
//     const hoverLens = document.createElement('div');
//     hoverLens.id = 'amazon-zoom-lens';
//     Object.assign(hoverLens.style, {
//         position: 'absolute',
//         border: '1px solid rgba(255, 255, 255, 0.6)',
//         backgroundColor: 'rgba(0, 0, 0, 0.3)',
//         display: 'none',
//         zIndex: '100',
//         pointerEvents: 'none',
//         boxSizing: 'border-box'
//     });
    
//     mainImgContainer.appendChild(hoverLens);

//     // Lens size - width double than height
//     const lensHeightPercent = 0.20; // 20% of image height
//     const lensWidthPercent = lensHeightPercent * 2; // Width is double the height (40% of image width)

//     let isMouseOver = false;

//     // Mouse enter - show lens and zoom window
//     mainImgContainer.addEventListener('mouseenter', function(e) {
//         isMouseOver = true;
//         updateZoomPosition(e);
//     });

//     // Mouse move - update position
//     mainImgContainer.addEventListener('mousemove', function(e) {
//         if (!isMouseOver) return;
//         updateZoomPosition(e);
//     });

//     // Mouse leave - hide everything
//     mainImgContainer.addEventListener('mouseleave', function() {
//         isMouseOver = false;
//         zoomWindow.style.display = 'none';
//         hoverLens.style.display = 'none';
//     });

//     function updateZoomPosition(e) {
//         const rect = mainImg.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         // Calculate lens size - width double than height
//         const lensWidth = rect.width * lensWidthPercent;
//         const lensHeight = rect.height * lensHeightPercent;

//         // Desired lens position (center follows mouse)
//         let desiredLeft = mouseX - (lensWidth / 2);
//         let desiredTop = mouseY - (lensHeight / 2);

//         // Allow lens to go out BUT clip visually inside image
//         let lensLeft = Math.max(0, Math.min(desiredLeft, rect.width - lensWidth));
//         let lensTop = Math.max(0, Math.min(desiredTop, rect.height - lensHeight));

//         // Update lens position
//         hoverLens.style.width = lensWidth + 'px';
//         hoverLens.style.height = lensHeight + 'px';
//         hoverLens.style.left = lensLeft + 'px';
//         hoverLens.style.top = lensTop + 'px';
//         hoverLens.style.display = 'block';

//         // ⭐ FIX: Zoom window stays at RIGHT-CENTER of the screen during hover
//         zoomWindow.style.position = 'fixed';
//         zoomWindow.style.left = 'calc(100vw - 770px)'; // 20px from right
//         zoomWindow.style.top = '50%';
//         zoomWindow.style.transform = 'translateY(-50%)';
//         zoomWindow.style.display = 'block';

//         // Calculate zoom (2x magnification)
//         const zoomLevel = 2;
//         zoomImg.style.width = (mainImg.naturalWidth * zoomLevel) + 'px';
//         zoomImg.style.height = (mainImg.naturalHeight * zoomLevel) + 'px';

//         // Calculate zoom image position based on lens center
//         const lensCenterX = lensLeft + (lensWidth / 2);
//         const lensCenterY = lensTop + (lensHeight / 2);
        
//         const xPercent = lensCenterX / rect.width;
//         const yPercent = lensCenterY / rect.height;

//         const zoomImgWidth = parseInt(zoomImg.style.width);
//         const zoomImgHeight = parseInt(zoomImg.style.height);

//         zoomImg.style.left = -xPercent * (zoomImgWidth - 750) + 'px';
//         zoomImg.style.top = -yPercent * (zoomImgHeight - 400) + 'px';
//     }

//     // Update when main image changes
//     mainImg.addEventListener('load', function() {
//         zoomImg.src = mainImg.src;
//     });

//     // Handle scroll
//     window.addEventListener('scroll', function() {
//         if (isMouseOver) return; // ❗ Do NOT hide zoom window when mouse is inside (your requirement)
//         zoomWindow.style.display = 'none';
//         hoverLens.style.display = 'none';
//     });

//     // Add CSS styles WITH OVERFLOW FIX
//     const style = document.createElement('style');
//     style.textContent = `
//         /* Ensure the lens can go outside but is clipped by the container */
//         .product-main-image {
//             position: relative !important;
//             overflow: hidden !important;
//             cursor: pointer !important;
//         }

//         #amazon-zoom-window {
//             background: #000 !important;
//             border: 1px solid #d5d9d9 !important;
//         }

//         #amazon-zoom-lens {
//             border: 1px solid rgba(255, 255, 255, 0.6) !important;
//             background: rgba(0, 0, 0, 0.3) !important;
//             backdrop-filter: blur(0.5px);
//         }

//         #amazon-zoom-lens::before {
//             content: "+";
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             color: white !important;
//             font-size: 35px !important;
//             font-weight: 50 !important;
//             text-shadow: 0 0 3px #000;
//             pointer-events: none;
//             z-index: 101;
//         }

//         @media (max-width: 768px) {
//             #amazon-zoom-window,
//             #amazon-zoom-lens {
//                 display: none !important;
//             }
//         }
//     `;
//     document.head.appendChild(style);

//     console.log('✅ Amazon zoom initialized successfully - With lens overflow & right-center scroll behavior');
// }

// // Fallback initialization
// setTimeout(function() {
//     if (!document.getElementById('amazon-zoom-window')) {
//         console.log('🔄 Fallback initialization...');
//         initializeZoom();
//     }
// }, 2000);
