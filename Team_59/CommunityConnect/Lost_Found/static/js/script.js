// File Upload Handling
const fileInput = document.getElementById('fileInput');
const uploadFileBtn = document.getElementById('uploadFileBtn');
const previewContainer = document.getElementById('previewContainer');
const capturedImageInput = document.getElementById('capturedImage');

let allImages = []; // Store all images (both uploaded and captured)

uploadFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
            allImages.push(e.target.result); // Add to the array of images
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            img.style.maxHeight = '200px';
            img.style.margin = '5px';
            img.style.borderRadius = '8px';
            previewContainer.appendChild(img); // Append to preview
        };
        reader.readAsDataURL(file);
    }
    capturedImageInput.value = allImages.join(';'); // Update the hidden input with all images
});

// Camera Capture Handling
const captureImageBtn = document.getElementById('captureImageBtn');
const cameraModal = document.getElementById('cameraModal');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snapBtn');
const closeCameraBtn = document.getElementById('closeCameraBtn');

let stream;

captureImageBtn.addEventListener('click', async () => {
    cameraModal.style.display = 'flex';
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access camera. Please allow camera permissions.');
        cameraModal.style.display = 'none';
    }
});

snapBtn.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/png');
    allImages.push(imageData); // Add to the array of images
    
    const img = document.createElement('img');
    img.src = imageData;
    img.style.maxWidth = '200px';
    img.style.maxHeight = '200px';
    img.style.margin = '5px';
    img.style.borderRadius = '8px';
    previewContainer.appendChild(img); // Append to preview
    
    capturedImageInput.value = allImages.join(';'); // Update the hidden input with all images
    fileInput.value = ''; // Clear file input if camera is used

    // Confirmation message
    alert('Image captured successfully!');
});

closeCameraBtn.addEventListener('click', () => {
    stopCamera();
    cameraModal.style.display = 'none';
});

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Toggle Collect Modal
const collectButtons = document.querySelectorAll('.collect-btn');
const modal = document.getElementById('collect-modal');
const closeBtn = document.querySelector('.close-btn');

if (collectButtons.length > 0) {
    collectButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}
