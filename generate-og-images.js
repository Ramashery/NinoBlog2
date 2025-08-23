/**
 * Скрипт для генерации OG-изображений для товаров
 * Генерирует уникальные изображения 1200x630px для каждой страницы товара
 */

class OGImageGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1200;
        this.canvas.height = 630;
        
        // Цветовая схема сайта
        this.colors = {
            primary: '#D4AF37',
            primaryDark: '#9B7C2E',
            background: '#121212',
            text: '#FFFFFF',
            textSecondary: 'rgba(255, 255, 255, 0.8)'
        };
    }

    // Генерирует OG-изображение для товара
    async generateProductImage(product) {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем фон
        this.drawBackground();
        
        // Рисуем градиент
        this.drawGradient();
        
        // Рисуем логотип
        this.drawLogo();
        
        // Рисуем изображение товара (если есть)
        if (product.images && product.images.length > 0) {
            await this.drawProductImage(product.images[0]);
        }
        
        // Рисуем информацию о товаре
        this.drawProductInfo(product);
        
        // Рисуем декоративные элементы
        this.drawDecorations();
        
        return this.canvas.toDataURL('image/png');
    }

    // Рисует фон
    drawBackground() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Рисует градиент
    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.1)');
        gradient.addColorStop(1, 'rgba(155, 124, 46, 0.05)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Рисует логотип
    drawLogo() {
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.font = 'bold 48px Montserrat, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('NINO KARTSIVADZE', 60, 80);
        
        this.ctx.fillStyle = this.colors.textSecondary;
        this.ctx.font = '24px Montserrat, sans-serif';
        this.ctx.fillText('CLOISONNE ENAMEL', 60, 110);
    }

    // Рисует изображение товара
    async drawProductImage(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // Рисуем круглое изображение товара
                const size = 300;
                const x = this.canvas.width - size - 60;
                const y = (this.canvas.height - size) / 2;
                
                // Создаем круглую маску
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
                this.ctx.clip();
                
                // Рисуем изображение
                this.ctx.drawImage(img, x, y, size, size);
                
                // Рисуем золотую рамку
                this.ctx.strokeStyle = this.colors.primary;
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
                
                this.ctx.restore();
                resolve();
            };
            
            img.onerror = () => {
                // Если изображение не загрузилось, рисуем заглушку
                this.drawPlaceholderImage();
                resolve();
            };
            
            img.src = imageUrl;
        });
    }

    // Рисует заглушку для изображения
    drawPlaceholderImage() {
        const size = 300;
        const x = this.canvas.width - size - 60;
        const y = (this.canvas.height - size) / 2;
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(x, y, size, size);
        
        this.ctx.strokeStyle = this.colors.primary;
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.textSecondary;
        this.ctx.font = '24px Montserrat, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Product Image', x + size/2, y + size/2);
    }

    // Рисует информацию о товаре
    drawProductInfo(product) {
        const maxWidth = 600;
        const startX = 60;
        const startY = 200;
        
        // Название товара
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.font = 'bold 36px Montserrat, sans-serif';
        this.ctx.textAlign = 'left';
        
        // Разбиваем длинное название на строки
        const titleLines = this.wrapText(product.title, maxWidth, this.ctx.font);
        titleLines.forEach((line, index) => {
            this.ctx.fillText(line, startX, startY + (index * 45));
        });
        
        // Описание
        if (product.description) {
            this.ctx.fillStyle = this.colors.textSecondary;
            this.ctx.font = '20px Montserrat, sans-serif';
            
            const descLines = this.wrapText(
                product.description.substring(0, 200) + '...', 
                maxWidth, 
                this.ctx.font
            );
            
            descLines.forEach((line, index) => {
                this.ctx.fillText(line, startX, startY + 120 + (index * 30));
            });
        }
        
        // Цена
        if (product.price) {
            this.ctx.fillStyle = this.colors.primary;
            this.ctx.font = 'bold 48px Montserrat, sans-serif';
            this.ctx.fillText(product.price, startX, startY + 300);
        }
        
        // Категория
        if (product.category) {
            this.ctx.fillStyle = this.colors.textSecondary;
            this.ctx.font = '18px Montserrat, sans-serif';
            this.ctx.fillText(`Category: ${product.category}`, startX, startY + 350);
        }
    }

    // Рисует декоративные элементы
    drawDecorations() {
        // Рисуем золотые точки
        this.ctx.fillStyle = this.colors.primary;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 4 + 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Рисуем декоративную линию
        this.ctx.strokeStyle = this.colors.primary;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(60, this.canvas.height - 80);
        this.ctx.lineTo(400, this.canvas.height - 80);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    // Разбивает текст на строки по ширине
    wrapText(text, maxWidth, font) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + ' ' + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }

    // Скачивает изображение
    downloadImage(filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OGImageGenerator;
} else {
    window.OGImageGenerator = OGImageGenerator;
}