class ImageEnhancer {
    constructor() {
        this.app = null;
        this.originalTexture = null;
        this.enhancedTexture = null;
        this.originalSprite = null;
        this.enhancedSprite = null;
        this.originalCanvas = document.getElementById('originalCanvas');
        this.enhancedCanvas = document.getElementById('enhancedCanvas');
        this.fileInput = document.getElementById('fileInput');
        this.currentImage = null; // 存储当前图片
        
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
                this.currentImage = img; // 保存当前图片
                // 显示原始图片
                this.displayOriginalImage(img);
                this.updateStatus('原始图片加载完成，可以开始增强处理', 'success');
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
        
        // 计算合适的显示尺寸
        const maxWidth = 400;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // 绘制图片
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
                this.updateStatus('图片上传成功，可以开始增强处理', 'success');
                
                // 清空增强画布
                const enhancedCtx = this.enhancedCanvas.getContext('2d');
                enhancedCtx.clearRect(0, 0, this.enhancedCanvas.width, this.enhancedCanvas.height);
                this.enhancedCanvas.width = 0;
                this.enhancedCanvas.height = 0;
                
                // 禁用下载按钮
                document.getElementById('downloadBtn').disabled = true;
                
                // 清除Pixi纹理缓存
                if (this.originalTexture) {
                    this.originalTexture.destroy();
                    this.originalTexture = null;
                }
                if (this.enhancedTexture) {
                    this.enhancedTexture.destroy();
                    this.enhancedTexture = null;
                }
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
            
            // 使用当前图片
            const img = this.currentImage;
            
            // 设置canvas尺寸
            tempCanvas.width = img.width * scale;
            tempCanvas.height = img.height * scale;
            
            // 高质量缩放
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            
            // 绘制缩放后的图片
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // 模拟处理时间，让用户看到进度
            await this.simulateProcessing();
            
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

    // 模拟处理进度
    async simulateProcessing() {
        return new Promise(resolve => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    resolve();
                } else {
                    this.updateStatus(`正在处理图片增强... ${Math.round(progress)}%`, 'loading');
                }
            }, 100);
        });
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