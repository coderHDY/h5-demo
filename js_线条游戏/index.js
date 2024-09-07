const gameArea = document.getElementById('gameArea');
const lines = [];

// 创建初始线条
function createInitialLines() {
    for (let i = 0; i < 5; i++) {
        createRandomLine();
    }
}

// 创建随机线条
function createRandomLine() {
    const line = document.createElement('div');
    line.classList.add('line');

    const isVertical = Math.random() < 0.5;
    const length = Math.random() * 100 + 50; // 线条长度
    const position = Math.random() * 100; // 线条位置

    if (isVertical) {
        line.style.width = '5px';
        line.style.height = `${length}px`;
        line.style.left = `${position}%`;
        line.style.top = '0';
    } else {
        line.style.width = `${length}px`;
        line.style.height = '5px';
        line.style.left = '0';
        line.style.top = `${position}%`;
    }

    line.style.transformOrigin = isVertical ? 'top' : 'left';
    gameArea.appendChild(line);
    lines.push(line);
}

// 鼠标悬停延伸线条
gameArea.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('line')) {
        const line = event.target;
        const isVertical = line.style.width === '5px';
        const length = parseFloat(isVertical ? line.style.height : line.style.width);
        line.style.width = isVertical ? '5px' : `${length + 20}px`;
        line.style.height = isVertical ? `${length + 20}px` : '5px';
    }
});

// 双击空白处生成新的随机线条
gameArea.addEventListener('dblclick', (event) => {
    if (!event.target.classList.contains('line')) {
        createRandomLine();
    }
});

// 单击已有线条空白处染色
gameArea.addEventListener('click', (event) => {
    if (event.target.classList.contains('line')) {
        const line = event.target;
        const boundingBox = line.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;

        // 检查点击位置是否在线条周围
        if (
            x > boundingBox.left &&
            x < boundingBox.right &&
            y > boundingBox.top &&
            y < boundingBox.bottom
        ) {
            const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            line.style.backgroundColor = randomColor;
        }
    }
});

// 初始化
createInitialLines();