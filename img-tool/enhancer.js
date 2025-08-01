class ImageEnhancer {
    constructor() {
        this.app = null;
        this.originalTexture = null;
        this.enhancedTexture = null;
        this.originalSprite = null;
        this.enhancedSprite = null;
        this.originalCanvas = document.getElementById('originalCanvas');
        this.enhancedCanvas = document.getElementById('enhancedCanvas');
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // 初始化Pixi应用
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        });
        
        // 加载原始图片
        this.loadOriginalImage();
    }
    
    async loadOriginalImage() {
        try {
            this.updateStatus('正在加载原始图片...', 'loading');
            
            // 创建图片元素
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // 显示原始图片
                this.displayOriginalImage(img);
                this.updateStatus('原始图片加载完成，可以开始增强处理', 'success');
            };
            
            img.onerror = () => {
                this.updateStatus('图片加载失败，请检查图片路径', 'error');
            };
            
            img.src = '1.jpg';
            
        } catch (error) {
            this.updateStatus('加载图片时发生错误: ' + error.message, 'error');
        }
    }
    
    displayOriginalImage(img) {
        const canvas = this.originalCanvas;
        const ctx = canvas.getContext('2d');
        
        // 计算合适的显示尺寸
        const maxWidth = 400;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    setupEventListeners() {
        // 同步滑块和数字输入框
        const controls = [
            { slider: 'scale', input: 'scaleValue' },
            { slider: 'sharpness', input: 'sharpnessValue' },
            { slider: 'brightness', input: 'brightnessValue' },
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
        
        // 增强按钮
        document.getElementById('enhanceBtn').addEventListener('click', () => {
            this.enhanceImage();
        });
        
        // 下载按钮
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadEnhancedImage();
        });
    }
    
    async enhanceImage() {
        try {
            this.updateStatus('正在处理图片增强...', 'loading');
            document.getElementById('enhanceBtn').disabled = true;
            
            // 获取参数
            const scale = parseFloat(document.getElementById('scale').value);
            const sharpness = parseFloat(document.getElementById('sharpness').value);
            const brightness = parseFloat(document.getElementById('brightness').value);
            const contrast = parseFloat(document.getElementById('contrast').value);
            
            // 创建临时canvas进行图片处理
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // 加载原始图片
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = '1.jpg';
            });
            
            // 设置canvas尺寸
            tempCanvas.width = img.width * scale;
            tempCanvas.height = img.height * scale;
            
            // 高质量缩放
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            
            // 绘制缩放后的图片
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // 获取图片数据
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            
            // 应用锐化滤镜
            if (sharpness > 0) {
                this.applySharpness(data, tempCanvas.width, tempCanvas.height, sharpness);
            }
            
            // 应用亮度和对比度调整
            if (brightness !== 0 || contrast !== 1) {
                this.applyBrightnessContrast(data, brightness, contrast);
            }
            
            // 将处理后的数据绘制回canvas
            tempCtx.putImageData(imageData, 0, 0);
            
            // 显示增强后的图片
            this.displayEnhancedImage(tempCanvas);
            
            // 保存增强后的图片数据
            this.enhancedCanvasData = tempCanvas;
            
            // 启用下载按钮
            document.getElementById('downloadBtn').disabled = false;
            
            this.updateStatus('图片增强完成！', 'success');
            document.getElementById('enhanceBtn').disabled = false;
            
        } catch (error) {
            this.updateStatus('图片增强过程中发生错误: ' + error.message, 'error');
            document.getElementById('enhanceBtn').disabled = false;
        }
    }
    
    applySharpness(data, width, height, intensity) {
        const tempData = new Uint8ClampedArray(data);
        const kernel = [
            0, -intensity, 0,
            -intensity, 1 + 4 * intensity, -intensity,
            0, -intensity, 0
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
                    const idx = (y * width + x) * 4 + c;
                    data[idx] = Math.max(0, Math.min(255, sum));
                }
            }
        }
    }
    
    applyBrightnessContrast(data, brightness, contrast) {
        for (let i = 0; i < data.length; i += 4) {
            // 应用对比度
            if (contrast !== 1) {
                data[i] = ((data[i] - 128) * contrast) + 128;     // R
                data[i + 1] = ((data[i + 1] - 128) * contrast) + 128; // G
                data[i + 2] = ((data[i + 2] - 128) * contrast) + 128; // B
            }
            
            // 应用亮度
            if (brightness !== 0) {
                const factor = 1 + brightness;
                data[i] = data[i] * factor;     // R
                data[i + 1] = data[i + 1] * factor; // G
                data[i + 2] = data[i + 2] * factor; // B
            }
            
            // 确保值在0-255范围内
            data[i] = Math.max(0, Math.min(255, data[i]));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
        }
    }
    
    displayEnhancedImage(canvas) {
        const displayCanvas = this.enhancedCanvas;
        const ctx = displayCanvas.getContext('2d');
        
        // 计算合适的显示尺寸
        const maxWidth = 400;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
        
        displayCanvas.width = canvas.width * scale;
        displayCanvas.height = canvas.height * scale;
        
        // 绘制增强后的图片
        ctx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);
    }
    
    downloadEnhancedImage() {
        if (!this.enhancedCanvasData) {
            this.updateStatus('没有可下载的增强图片', 'error');
            return;
        }
        
        try {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = '2.jpg';
            
            // 将canvas转换为blob
            this.enhancedCanvasData.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                this.updateStatus('图片已下载为 2.jpg', 'success');
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
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ImageEnhancer();
}); 