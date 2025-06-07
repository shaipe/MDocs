export const drawArrowBetween = (
	div1: HTMLElement,
	div2: HTMLElement,
	container: HTMLElement,
	direction: 'vertical' | 'horizontal' = 'horizontal',
	allowSize: number = 4,
	color: string = 'black'
): void => {
	// 创建或获取 SVG 容器
	// let svg = container.querySelector('svg') as SVGSVGElement;
	// if (!svg) {
	let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.style.position = 'absolute';
	svg.style.top = '0';
	svg.style.left = '0';
	svg.style.width = '100%';
	svg.style.height = '100%';
	svg.style.pointerEvents = 'none'; // 禁止交互
	container.appendChild(svg);
	// }

	console.log(svg);

	// 获取 div 的位置和尺寸
	const rect1 = div1.getBoundingClientRect();
	const rect2 = div2.getBoundingClientRect();
	const containerRect = container.getBoundingClientRect();

	console.log(rect1, rect2, containerRect);

	// 计算线条的起点和终点
	let x1: number, y1: number, x2: number, y2: number;
	if (direction === 'horizontal') {
		x1 = rect1.right - containerRect.left;
		y1 = rect1.top + rect1.height / 2 - containerRect.top;
		x2 = rect2.left - containerRect.left;
		y2 = rect2.top + rect2.height / 2 - containerRect.top;
	} else {
		x1 = rect1.left + rect1.width / 2 - containerRect.left;
		y1 = rect1.bottom - containerRect.top;
		x2 = rect2.left + rect2.width / 2 - containerRect.left;
		y2 = rect2.top - containerRect.top;
	}

	// 创建箭头标记
	const arrowId = `arrowhead-${direction}`;
	if (!svg.querySelector(`#${arrowId}`)) {
		const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
		const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
		marker.setAttribute('id', arrowId);
		marker.setAttribute('markerWidth', allowSize.toString());
		marker.setAttribute('markerHeight', allowSize.toString());
		marker.setAttribute('refX', (allowSize / 2).toString());
		marker.setAttribute('refY', (allowSize / 2).toString());
		marker.setAttribute('orient', 'auto');

		const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		arrowPath.setAttribute('d', `M 0 0 L ${allowSize} ${allowSize / 2} L 0 ${allowSize} Z`);
		arrowPath.setAttribute('fill', color);

		marker.appendChild(arrowPath);
		defs.appendChild(marker);
		svg.appendChild(defs);
	}

	// 创建或更新线条
	let line = svg.querySelector('.arrow-line') as SVGLineElement;
	if (!line) {
		line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('class', 'arrow-line');
		line.setAttribute('stroke', color);
		line.setAttribute('stroke-width', allowSize > 4 ? '2' : '1.5');
		line.setAttribute('marker-end', `url(#${arrowId})`);
		svg.appendChild(line);
	}

	line.setAttribute('x1', x1.toString());
	line.setAttribute('y1', y1.toString());
	line.setAttribute('x2', x2.toString());
	line.setAttribute('y2', y2.toString());
};

// 画线
export function drawArrowedLine(
	ctx: CanvasRenderingContext2D,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	color: string = 'black',
	arrowSize: number = 8
) {
	if (!ctx) {
		throw new Error('Canvas rendering context is not provided.');
	}

	// 绘制主线
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.stroke();

	// 计算箭头方向
	const angle = Math.atan2(endY - startY, endX - startX);

	// 绘制箭头
	ctx.beginPath();
	ctx.moveTo(endX, endY);
	ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
	ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}
