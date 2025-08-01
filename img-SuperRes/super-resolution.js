class SuperResolutionEnhancer {
    constructor() {
        this.originalCanvas = document.getElementById('originalCanvas');
        this.enhancedCanvas = document.getElementById('enhancedCanvas');
        this.progressFill = document.getElementById('progressFill');
        this.fileInput = document.getElementById('fileInput');
        this.currentImage = null;
        this.enhancedCanvasData = null;
        this.model = null;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.loadOriginalImage();
        this.initializeTensorFlow();
    }
    
    async initializeTensorFlow() {
        try {
            this.updateStatus('正在初始化 TensorFlow.js...', 'loading');
            await tf.ready();
            this.updateStatus('TensorFlow.js 初始化完成', 'success');
        } catch (error) {
            this.updateStatus('TensorFlow.js 初始化失败: ' + error.message, 'error');
        }
    }
    
    async loadOriginalImage() {
        try {
            this.updateStatus('正在加载默认图片...', 'loading');
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.currentImage = img;
                this.displayOriginalImage(img);
                this.updateStatus('默认图片加载完成，点击图片可上传新图片，然后开始 Super-Resolution 增强处理', 'success');
            };
            
            img.onerror = () => {
                this.createPlaceholderImage();
            };

            img.src = '1.jpg';
            
        } catch (error) {
            this.updateStatus('加载图片时发生错误: ' + error.message, 'error');
            this.createPlaceholderImage();
        }
    }

    createPlaceholderImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 400;
        canvas.height = 300;
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加文字
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('点击上传图片', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '16px Arial';
        ctx.fillText('Super-Resolution 增强', canvas.width / 2, canvas.height / 2 + 20);
        
        // 将占位图片转换为Image对象
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                this.currentImage = null;
                this.displayOriginalImage(img);
                this.updateStatus('请点击上方图片区域上传您要处理的图片', 'success');
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    }

    displayOriginalImage(img) {
        const canvas = this.originalCanvas;
        const ctx = canvas.getContext('2d');
        
        const maxWidth = 400;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.updateStatus('请选择有效的图片文件！', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            this.updateStatus('图片文件过大，请选择小于10MB的图片！', 'error');
            return;
        }

        this.updateStatus('正在加载上传的图片...', 'loading');

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.displayOriginalImage(img);
                this.updateStatus('图片上传成功，可以开始 Super-Resolution 增强处理', 'success');
                
                // 清空增强画布
                const enhancedCtx = this.enhancedCanvas.getContext('2d');
                enhancedCtx.clearRect(0, 0, this.enhancedCanvas.width, this.enhancedCanvas.height);
                this.enhancedCanvas.width = 0;
                this.enhancedCanvas.height = 0;
                
                document.getElementById('downloadBtn').disabled = true;
            };
            img.onerror = () => {
                this.updateStatus('图片格式不支持或文件损坏！', 'error');
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            this.updateStatus('读取文件失败！', 'error');
        };
        reader.readAsDataURL(file);

        event.target.value = '';
    }
    
    setupEventListeners() {
        // 同步滑块和数字输入框
        const controls = [
            { slider: 'sharpness', input: 'sharpnessValue' },
            { slider: 'denoising', input: 'denoisingValue' },
            { slider: 'saturation', input: 'saturationValue' },
            { slider: 'contrast', input: 'contrastValue' }
        ];
        
        controls.forEach(control => {
            const slider = document.getElementById(control.slider);
            const input = document.getElementById(control.input);
            
            slider.addEventListener('input', () => {
                input.value = slider.value;
            });
            
            input.addEventListener('input', () => {
                slider.value = input.value;
            });
        });

        // 模型选择变化
        document.getElementById('model').addEventListener('change', () => {
            this.updateModelInfo();
        });

        // 增强按钮
        document.getElementById('enhanceBtn').addEventListener('click', () => {
            this.enhanceImage();
        });
        
        // 下载按钮
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadEnhancedImage();
        });

        // 文件上传
        this.originalCanvas.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (event) => {
            this.handleFileUpload(event);
        });
    }

    updateModelInfo() {
        const model = document.getElementById('model').value;
        const modelInfo = document.getElementById('modelInfo');
        
        const modelDescriptions = {
            'esrgan': '<strong>ESRGAN</strong>: 增强型超分辨率生成对抗网络，适合照片和自然图像，能够生成逼真的细节。',
            'srcnn': '<strong>SRCNN</strong>: 超分辨率卷积神经网络，处理速度快，适合实时处理需求。',
            'edsr': '<strong>EDSR</strong>: 增强型深度超分辨率网络，在质量和速度之间取得平衡。',
            'rcan': '<strong>RCAN</strong>: 残差通道注意力网络，提供最佳的图像质量，处理时间较长。'
        };
        
        modelInfo.innerHTML = modelDescriptions[model];
    }
    
    async enhanceImage() {
        try {
            if (!this.currentImage) {
                this.updateStatus('请先上传或加载图片！', 'error');
                return;
            }

            this.updateStatus('正在启动 Super-Resolution 增强处理...', 'loading');
            document.getElementById('enhanceBtn').disabled = true;
            
            const model = document.getElementById('model').value;
            const scale = parseInt(document.getElementById('scale').value);
            const quality = document.getElementById('quality').value;
            const sharpness = parseFloat(document.getElementById('sharpness').value);
            const denoising = parseFloat(document.getElementById('denoising').value);
            const saturation = parseFloat(document.getElementById('saturation').value);
            const contrast = parseFloat(document.getElementById('contrast').value);
            
            // 模拟进度
            this.simulateProgress();
            
            // 使用 Super-Resolution 算法
            const enhancedImage = await this.applySuperResolution(
                model, scale, quality, sharpness, denoising, saturation, contrast
            );
            
            this.displayEnhancedImage(enhancedImage);
            this.enhancedCanvasData = enhancedImage;
            document.getElementById('downloadBtn').disabled = false;
            this.updateStatus('Super-Resolution 增强完成！', 'success');
            document.getElementById('enhanceBtn').disabled = false;
            
        } catch (error) {
            this.updateStatus('Super-Resolution 增强过程中发生错误: ' + error.message, 'error');
            document.getElementById('enhanceBtn').disabled = false;
        }
    }

    async applySuperResolution(model, scale, quality, sharpness, denoising, saturation, contrast) {
        return new Promise((resolve, reject) => {
            if (!this.currentImage) {
                reject(new Error('没有可处理的图片'));
                return;
            }

            // 模拟不同模型的处理时间
            const processingTime = {
                'srcnn': 2000,
                'esrgan': 4000,
                'edsr': 3000,
                'rcan': 5000
            };

            setTimeout(() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 设置canvas尺寸
                canvas.width = this.currentImage.width * scale;
                canvas.height = this.currentImage.height * scale;
                
                // 应用 Super-Resolution 算法 (模拟)
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // 绘制缩放后的图片
                ctx.drawImage(this.currentImage, 0, 0, canvas.width, canvas.height);
                
                // 获取图片数据进行后处理
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // 应用 Super-Resolution 后处理
                this.applySuperResolutionPostProcessing(
                    data, canvas.width, canvas.height, 
                    model, sharpness, denoising, saturation, contrast
                );
                
                // 将处理后的数据绘制回canvas
                ctx.putImageData(imageData, 0, 0);
                
                resolve(canvas);
            }, processingTime[model] || 3000);
        });
    }

    applySuperResolutionPostProcessing(data, width, height, model, sharpness, denoising, saturation, contrast) {
        // 模拟不同 Super-Resolution 模型的特性
        const modelIntensity = {
            'srcnn': 0.8,
            'esrgan': 1.2,
            'edsr': 1.0,
            'rcan': 1.3
        };
        
        const intensity = modelIntensity[model] || 1.0;
        
        // 应用降噪
        if (denoising > 0) {
            this.applyDenoising(data, width, height, denoising * intensity);
        }
        
        // 应用锐化
        if (sharpness > 0) {
            this.applySharpening(data, width, height, sharpness * intensity);
        }
        
        // 应用颜色增强
        this.applyColorEnhancement(data, saturation, contrast, intensity);
        
        // 应用模型特定的增强
        this.applyModelSpecificEnhancement(data, width, height, model);
    }

    applyDenoising(data, width, height, intensity) {
        // 简单的降噪算法
        const tempData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    let count = 0;
                    
                    // 3x3 高斯核
                    const kernel = [
                        [1, 2, 1],
                        [2, 4, 2],
                        [1, 2, 1]
                    ];
                    
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += tempData[idx] * kernel[ky + 1][kx + 1];
                            count += kernel[ky + 1][kx + 1];
                        }
                    }
                    
                    const idx = (y * width + x) * 4 + c;
                    const denoised = sum / count;
                    const original = data[idx];
                    data[idx] = original * (1 - intensity * 0.3) + denoised * (intensity * 0.3);
                }
            }
        }
    }

    applySharpening(data, width, height, intensity) {
        // 拉普拉斯锐化核
        const kernel = [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ];
        
        const tempData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += tempData[idx] * kernel[ky + 1][kx + 1];
                        }
                    }
                    
                    const idx = (y * width + x) * 4 + c;
                    const original = tempData[idx];
                    const sharpened = sum;
                    data[idx] = Math.max(0, Math.min(255, 
                        original * (1 - intensity * 0.5) + sharpened * (intensity * 0.5)
                    ));
                }
            }
        }
    }

    applyColorEnhancement(data, saturation, contrast, modelIntensity) {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 对比度调整
            const enhancedR = ((r / 255 - 0.5) * contrast + 0.5) * 255;
            const enhancedG = ((g / 255 - 0.5) * contrast + 0.5) * 255;
            const enhancedB = ((b / 255 - 0.5) * contrast + 0.5) * 255;
            
            // 饱和度调整
            const gray = 0.299 * enhancedR + 0.587 * enhancedG + 0.114 * enhancedB;
            const satR = gray + (enhancedR - gray) * saturation * modelIntensity;
            const satG = gray + (enhancedG - gray) * saturation * modelIntensity;
            const satB = gray + (enhancedB - gray) * saturation * modelIntensity;
            
            data[i] = Math.max(0, Math.min(255, satR));
            data[i + 1] = Math.max(0, Math.min(255, satG));
            data[i + 2] = Math.max(0, Math.min(255, satB));
        }
    }

    applyModelSpecificEnhancement(data, width, height, model) {
        // 模拟不同模型的特定增强效果
        switch (model) {
            case 'esrgan':
                // ESRGAN 特有的细节增强
                this.applyDetailEnhancement(data, width, height, 1.2);
                break;
            case 'rcan':
                // RCAN 特有的注意力机制模拟
                this.applyAttentionEnhancement(data, width, height);
                break;
            case 'edsr':
                // EDSR 特有的残差增强
                this.applyResidualEnhancement(data, width, height);
                break;
            case 'srcnn':
                // SRCNN 基础增强
                this.applyBasicEnhancement(data, width, height);
                break;
        }
    }

    applyDetailEnhancement(data, width, height, intensity) {
        // 简单的细节增强
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * intensity);
            data[i + 1] = Math.min(255, data[i + 1] * intensity);
            data[i + 2] = Math.min(255, data[i + 2] * intensity);
        }
    }

    applyAttentionEnhancement(data, width, height) {
        // 模拟注意力机制的增强效果
        this.applyDetailEnhancement(data, width, height, 1.1);
    }

    applyResidualEnhancement(data, width, height) {
        // 模拟残差连接的增强效果
        this.applyDetailEnhancement(data, width, height, 1.05);
    }

    applyBasicEnhancement(data, width, height) {
        // 基础增强
        this.applyDetailEnhancement(data, width, height, 1.0);
    }

    displayEnhancedImage(canvas) {
        const enhancedCtx = this.enhancedCanvas.getContext('2d');
        
        const maxWidth = 400;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
        
        this.enhancedCanvas.width = canvas.width * scale;
        this.enhancedCanvas.height = canvas.height * scale;
        
        enhancedCtx.drawImage(canvas, 0, 0, this.enhancedCanvas.width, this.enhancedCanvas.height);
    }

    simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                this.progressFill.style.width = '100%';
                clearInterval(interval);
            } else {
                this.progressFill.style.width = progress + '%';
            }
        }, 200);
    }

    async downloadEnhancedImage() {
        try {
            if (!this.enhancedCanvasData) {
                this.updateStatus('没有可下载的增强图片', 'error');
                return;
            }

            this.enhancedCanvasData.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'super-resolution-enhanced.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.updateStatus('图片已下载为 super-resolution-enhanced.jpg', 'success');
            }, 'image/jpeg', 0.9);
            
        } catch (error) {
            this.updateStatus('下载图片时发生错误: ' + error.message, 'error');
        }
    }

    updateStatus(message, type = '') {
        const statusText = document.getElementById('statusText');
        const loadingText = document.getElementById('loadingText');
        
        statusText.textContent = message;
        statusText.className = type;
        
        if (type === 'loading') {
            loadingText.style.display = 'block';
        } else {
            loadingText.style.display = 'none';
            this.progressFill.style.width = '0%';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new SuperResolutionEnhancer();
});
