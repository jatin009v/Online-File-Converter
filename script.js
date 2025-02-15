document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const fileList = document.getElementById('fileList');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const conversionProgress = document.getElementById('conversionProgress');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progressPercent');

    // Supported formats
    const supportedFormats = {
        documents: ['pdf', 'docx', 'txt'],
        images: ['jpg', 'png', 'gif', 'webp'],
        audio: ['mp3', 'wav', 'ogg']
    };

    let selectedFile = null;

    // Drag and drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('dragover');
    }

    function unhighlight() {
        dropZone.classList.remove('dragover');
    }

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFile(file);
    }

    // Handle file selection via button
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file) return;

        selectedFile = file;
        convertBtn.disabled = false;
        updateFileList(file);
    }

    function updateFileList(file) {
        const fileSize = formatFileSize(file.size);
        const fileIcon = getFileIcon(file.type);
        
        fileList.innerHTML = `
            <div class="file-item">
                <i class="${fileIcon}"></i>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
        `;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return 'fas fa-image';
        if (mimeType.startsWith('audio/')) return 'fas fa-music';
        if (mimeType.startsWith('video/')) return 'fas fa-video';
        if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
        if (mimeType.includes('document')) return 'fas fa-file-word';
        return 'fas fa-file';
    }

    // Quality slider
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
    });

    // Convert button handler
    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const targetFormat = document.getElementById('targetFormat').value;
        const quality = qualitySlider.value;

        // Show progress
        conversionProgress.hidden = false;
        let progress = 0;

        // Simulate conversion progress
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressPercent.textContent = Math.round(progress) + '%';

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    completeConversion(selectedFile, targetFormat);
                }, 500);
            }
        }, 200);
    });

    function completeConversion(file, targetFormat) {
        // In a real implementation, this would handle the actual file conversion
        // For now, we'll simulate the download of a converted file
        
        const fileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.' + targetFormat;
        
        // Create a success message with download button
        const successMessage = document.createElement('div');
        successMessage.className = 'file-item';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle" style="color: #00b894;"></i>
            <div class="file-info">
                <div class="file-name">Conversion Complete: ${fileName}</div>
                <div class="file-size">Ready for download</div>
            </div>
            <button class="download-btn" onclick="downloadFile('${fileName}')">
                <i class="fas fa-download"></i> Download
            </button>
        `;
        
        fileList.appendChild(successMessage);
        
        // Reset progress
        setTimeout(() => {
            conversionProgress.hidden = true;
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
        }, 1000);
    }

    // Add download function
    window.downloadFile = function(fileName) {
        // Create a blob with some sample content
        // In a real implementation, this would be the actual converted file content
        const content = new Blob(['Converted file content'], { type: 'application/octet-stream' });
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = fileName;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Cleanup
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    };
});
