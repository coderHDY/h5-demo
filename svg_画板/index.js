const drawingArea = document.getElementById('drawing-area');
        const pencilBtn = document.getElementById('pencil-btn');
        const eraserBtn = document.getElementById('eraser-btn');
        const undoBtn = document.getElementById('undo-btn');
        const exportSvgBtn = document.getElementById('export-svg-btn');
        const exportPngBtn = document.getElementById('export-png-btn');

        let isDrawing = false;
        let currentTool = 'pencil';
        let drawingHistory = [];
        let currentPath;

        drawingArea.addEventListener('mousedown', startDrawing);
        drawingArea.addEventListener('mousemove', draw);
        drawingArea.addEventListener('mouseup', stopDrawing);

        pencilBtn.addEventListener('click', () => {
            currentTool = 'pencil';
            drawingArea.style.cursor = 'crosshair';
        });

        eraserBtn.addEventListener('click', () => {
            currentTool = 'eraser';
            drawingArea.style.cursor = 'pointer';
        });

        undoBtn.addEventListener('click', undo);

        exportSvgBtn.addEventListener('click', exportAsSVG);
        exportPngBtn.addEventListener('click', exportAsPNG);

        function startDrawing(e) {
            isDrawing = true;
            const rect = drawingArea.getBoundingClientRect();
            currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const startX = e.clientX - rect.left;
            const startY = e.clientY - rect.top;
            currentPath.setAttribute('d', `M ${startX} ${startY} `); // Move to start point
            currentPath.setAttribute('stroke', currentTool === 'pencil' ? 'black' : 'white');
            currentPath.setAttribute('stroke-width', currentTool === 'pencil' ? '2' : '10');
            currentPath.setAttribute('fill', 'none');
            drawingArea.appendChild(currentPath);
            drawingHistory.push(currentPath);
        }

        function draw(e) {
            if (!isDrawing) return;
            const rect = drawingArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const pathData = currentPath.getAttribute('d') + ` L ${x} ${y}`; // Line to current mouse position
            currentPath.setAttribute('d', pathData);
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function undo() {
            if (drawingHistory.length === 0) return;
            const lastPath = drawingHistory.pop();
            drawingArea.removeChild(lastPath);
        }

        function exportAsSVG() {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(drawingArea);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'drawing.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function exportAsPNG() {
            const svgData = new XMLSerializer().serializeToString(drawingArea);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            img.onload = function() {
                canvas.width = drawingArea.clientWidth;
                canvas.height = drawingArea.clientHeight;
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                const png = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = png;
                a.download = 'drawing.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            img.src = url;
        }