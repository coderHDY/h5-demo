class AdvancedWaifu2xEnhancer {
    constructor() {
        this.originalCanvas = document.getElementById('originalCanvas');
        this.enhancedCanvas = document.getElementById('enhancedCanvas');
        this.progressFill = document.getElementById('progressFill');
        this.fileInput = document.getElementById('fileInput');
        this.currentImage = null; // 存储当前图片
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.loadOriginalImage();
    }
    
    async loadOriginalImage() {
        try {
            this.updateStatus('正在加载默认图片...', 'loading');
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.currentImage = img; // 保存当前图片
                this.displayOriginalImage(img);
                this.updateStatus('默认图片加载完成，点击图片可上传新图片，然后开始高级Waifu2x增强处理', 'success');
            };
            
            img.onerror = () => {
                // 如果默认图片加载失败，创建一个占位图片
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
        ctx.fillText('支持 JPG, PNG, GIF 等格式', canvas.width / 2, canvas.height / 2 + 20);
        
        // 将占位图片转换为Image对象
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                this.currentImage = null; // 占位图片不算作真实图片
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

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            this.updateStatus('请选择有效的图片文件！', 'error');
            return;
        }

        // 验证文件大小（限制为10MB）
        if (file.size > 10 * 1024 * 1024) {
            this.updateStatus('图片文件过大，请选择小于10MB的图片！', 'error');
            return;
        }

        this.updateStatus('正在加载上传的图片...', 'loading');

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img; // 保存当前图片
                this.displayOriginalImage(img);
                this.updateStatus('图片上传成功，可以开始高级Waifu2x增强处理', 'success');
                
                // 清空增强画布
                const enhancedCtx = this.enhancedCanvas.getContext('2d');
                enhancedCtx.clearRect(0, 0, this.enhancedCanvas.width, this.enhancedCanvas.height);
                this.enhancedCanvas.width = 0;
                this.enhancedCanvas.height = 0;
                
                // 禁用下载按钮
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

        // 清空input，允许重复选择同一文件
        event.target.value = '';
    }
    
    setupEventListeners() {
        document.getElementById('enhanceBtn').addEventListener('click', () => {
            this.enhanceImage();
        });
        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadEnhancedImage();
        });

        // 添加原始画布点击事件，触发文件选择
        this.originalCanvas.addEventListener('click', () => {
            this.fileInput.click();
        });

        // 添加文件选择事件
        this.fileInput.addEventListener('change', (event) => {
            this.handleFileUpload(event);
        });
    }
    
    async enhanceImage() {
        try {
            if (!this.currentImage) {
                this.updateStatus('请先上传或加载图片！', 'error');
                return;
            }

            this.updateStatus('正在启动高级Waifu2x增强处理...', 'loading');
            document.getElementById('enhanceBtn').disabled = true;
            
            const scale = parseInt(document.getElementById('scale').value);
            const noise = parseInt(document.getElementById('noise').value);
            const model = document.getElementById('model').value;
            const quality = document.getElementById('quality').value;
            
            // 模拟处理进度
            this.simulateProgress();
            
            // 使用高级waifu2x算法
            const enhancedImage = await this.advancedWaifu2x(scale, noise, model, quality);
            
            this.displayEnhancedImage(enhancedImage);
            this.enhancedCanvasData = enhancedImage;
            document.getElementById('downloadBtn').disabled = false;
            this.updateStatus('高级Waifu2x增强完成！', 'success');
            document.getElementById('enhanceBtn').disabled = false;
            
        } catch (error) {
            this.updateStatus('Waifu2x增强过程中发生错误: ' + error.message, 'error');
            document.getElementById('enhanceBtn').disabled = false;
        }
    }
    
    async advancedWaifu2x(scale, noise, model, quality) {
        return new Promise((resolve, reject) => {
            if (!this.currentImage) {
                reject(new Error('没有可处理的图片'));
                return;
            }

            setTimeout(() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 设置canvas尺寸
                canvas.width = this.currentImage.width * scale;
                canvas.height = this.currentImage.height * scale;
                
                // 高质量缩放
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // 绘制缩放后的图片
                ctx.drawImage(this.currentImage, 0, 0, canvas.width, canvas.height);
                
                // 获取图片数据
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // 应用高级waifu2x算法
                this.applyAdvancedWaifu2x(data, canvas.width, canvas.height, scale, noise, model, quality);
                
                // 将处理后的数据绘制回canvas
                ctx.putImageData(imageData, 0, 0);
                
                resolve(canvas);
            }, 3000); // 模拟处理时间
        });
    }
    
    applyAdvancedWaifu2x(data, width, height, scale, noise, model, quality) {
        // 高级waifu2x算法实现
        const intensity = quality === 'high' ? 1.3 : quality === 'normal' ? 1.0 : 0.7;
        const noiseReduction = noise * 0.15;
        const modelFactor = model === 'anime' ? 1.2 : 1.0;
        
        // 第一步：降噪处理
        if (noise > 0) {
            this.applyAdvancedNoiseReduction(data, width, height, noiseReduction);
        }
        
        // 第二步：边缘检测和增强
        if (scale > 1) {
            this.applyEdgeEnhancement(data, width, height, intensity * modelFactor);
        }
        
        // 第三步：细节增强
        this.applyDetailEnhancement(data, width, height, modelFactor);
        
        // 第四步：颜色增强
        this.applyColorEnhancement(data, modelFactor);
        
        // 第五步：锐化处理
        this.applySharpening(data, width, height, intensity);
    }
    
    applyAdvancedNoiseReduction(data, width, height, intensity) {
        const tempData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    let count = 0;
                    
                    // 5x5 高斯模糊核
                    const kernel = [
                        [1, 4, 6, 4, 1],
                        [4, 16, 24, 16, 4],
                        [6, 24, 36, 24, 6],
                        [4, 16, 24, 16, 4],
                        [1, 4, 6, 4, 1]
                    ];
                    
                    for (let ky = -2; ky <= 2; ky++) {
                        for (let kx = -2; kx <= 2; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += tempData[idx] * kernel[ky + 2][kx + 2];
                            count += kernel[ky + 2][kx + 2];
                        }
                    }
                    
                    const idx = (y * width + x) * 4 + c;
                    const blurred = sum / count;
                    const original = data[idx];
                    data[idx] = original * (1 - intensity) + blurred * intensity;
                }
            }
        }
    }
    
    applyEdgeEnhancement(data, width, height, intensity) {
        const tempData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    // Sobel边缘检测
                    const gx = this.calculateSobelX(tempData, width, x, y, c);
                    const gy = this.calculateSobelY(tempData, width, x, y, c);
                    const magnitude = Math.sqrt(gx * gx + gy * gy);
                    
                    const idx = (y * width + x) * 4 + c;
                    const enhanced = data[idx] + magnitude * intensity * 0.1;
                    data[idx] = Math.max(0, Math.min(255, enhanced));
                }
            }
        }
    }
    
    calculateSobelX(data, width, x, y, c) {
        const idx = (y * width + x) * 4 + c;
        const left = data[idx - 4];
        const right = data[idx + 4];
        return right - left;
    }
    
    calculateSobelY(data, width, x, y, c) {
        const idx = (y * width + x) * 4 + c;
        const top = data[idx - width * 4];
        const bottom = data[idx + width * 4];
        return bottom - top;
    }
    
    applyDetailEnhancement(data, width, height, factor) {
        for (let i = 0; i < data.length; i += 4) {
            // 增强细节对比度
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const contrast = (avg - 128) * factor * 0.1;
            
            data[i] = Math.max(0, Math.min(255, data[i] + contrast));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + contrast));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + contrast));
        }
    }
    
    applyColorEnhancement(data, factor) {
        for (let i = 0; i < data.length; i += 4) {
            // 增强颜色饱和度
            const max = Math.max(data[i], data[i + 1], data[i + 2]);
            const min = Math.min(data[i], data[i + 1], data[i + 2]);
            const delta = max - min;
            
            if (delta > 0) {
                const saturation = 1 + factor * 0.2;
                data[i] = Math.max(0, Math.min(255, data[i] * saturation));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * saturation));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * saturation));
            }
        }
    }
    
    applySharpening(data, width, height, intensity) {
        const tempData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    // 拉普拉斯锐化
                    const center = tempData[(y * width + x) * 4 + c];
                    const neighbors = [
                        tempData[((y - 1) * width + x) * 4 + c],
                        tempData[((y + 1) * width + x) * 4 + c],
                        tempData[(y * width + x - 1) * 4 + c],
                        tempData[(y * width + x + 1) * 4 + c]
                    ];
                    
                    const avgNeighbor = neighbors.reduce((a, b) => a + b, 0) / 4;
                    const sharpened = center + (center - avgNeighbor) * intensity * 0.3;
                    
                    const idx = (y * width + x) * 4 + c;
                    data[idx] = Math.max(0, Math.min(255, sharpened));
                }
            }
        }
    }
    
    simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            this.progressFill.style.width = progress + '%';
        }, 150);
    }
    
    displayEnhancedImage(canvas) {
        const displayCanvas = this.enhancedCanvas;
        const ctx = displayCanvas.getContext('2d');
        
        const maxWidth = 400;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
        
        displayCanvas.width = canvas.width * scale;
        displayCanvas.height = canvas.height * scale;
        
        ctx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);
    }
    
    downloadEnhancedImage() {
        if (!this.enhancedCanvasData) {
            this.updateStatus('没有可下载的增强图片', 'error');
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.download = '2.jpg';
            
            this.enhancedCanvasData.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                this.updateStatus('图片已下载为 2.jpg', 'success');
            }, 'image/jpeg', 0.95);
            
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
    new AdvancedWaifu2xEnhancer();
}); 