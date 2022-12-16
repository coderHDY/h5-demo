// New Features
// ------------------
// - Proper multitouch support!
// 支持多点触控

// Inlined Stage.js dependency: Ticker.js
// 内嵌式 stage 依赖: Ticker.js
/**
 * Stage.js
 * -----------
 * Super simple "stage" abstraction for canvas. Combined with Ticker.js, it helps simplify:
 * 简单的 canvas 舞台抽象，配合 ticker.js 有助于简化
 *   - Preparing a canvas for drawing.
 *   - 准备 canvas 画布
 *   - High resolution rendering.
 *   - 高渲染性能
 *   - Resizing the canvas.
 *   - Pointer events (mouse and touch).
 *   - 鼠标和点击事件
 *   - Frame callbacks with useful timing data and calculated lag.
 *   - 配合有用的时间数据和计算【滞后】 的帧回调
 *
 * This is no replacement for robust canvas drawing libraries; it's designed to be as lightweight as possible and defers
 * full rendering burden to user.
 * 这并不能完全的替代【强大的】canvas绘画库，它只是设计作为轻量级的尽可能将全部绘画【能力交给】用户
*/

const Ticker = (function TickerFactory(window) {
	'use strict';

	const Ticker = {};


	// public
	// will call function reference repeatedly once registered, passing elapsed time and a lag multiplier as parameters
	// 【一旦】注册，将会重复调用，作为参数传递【经过时间】和【滞后乘数】
	Ticker.addListener = function addListener(callback) {
		if (typeof callback !== 'function') throw ('Ticker.addListener() requires a function reference passed for a callback.');

		listeners.push(callback);

		// start frame-loop lazily
		if (!started) {
			started = true;
			queueFrame();
		}
	};

	// private
	// 私有的
	let started = false;
	let lastTimestamp = 0;
	let listeners = [];

	// queue up a new frame (calls frameHandler)
	// 判断 animation Frame 可调用类型并调用更新控制器
	function queueFrame() {
		if (window.requestAnimationFrame) {
			requestAnimationFrame(frameHandler);
		} else {
			webkitRequestAnimationFrame(frameHandler);
		}
	}

	// 更新控制器，注：requestAnimationFrame 第一个参数会传入当前距离网页打开的时间戳
	// 用【计算桢】来控制视图展示位置
	function frameHandler(timestamp) {
		let frameTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;
		// make sure negative time isn't reported (first frame can be whacky)
		// 确保不会报负时间，第一祯是【古怪的】
		if (frameTime < 0) {
			frameTime = 17;
		}
		// - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
		// 一秒60帧，一桢17毫秒，如果浏览器过卡，也让每桢控制在68毫秒内，也就是每秒14帧左右
		else if (frameTime > 68) {
			frameTime = 68;
		}

		// fire custom listeners
		// frame time 控制在 17-68 毫秒内，那么一次跳转 1～4.25 帧
		listeners.forEach(listener => listener.call(window, frameTime, frameTime / 16.6667));

		// always queue another frame
		// 开启下轮轮询
		queueFrame();
	}


	return Ticker;

})(window);



const Stage = (function StageFactory(window, document, Ticker) {
	'use strict';

	// Track touch times to prevent redundant mouse events.
	// 跟踪点击时间，防止多余的鼠标事件
	let lastTouchTimestamp = 0;

	// Stage constructor (canvas can be a dom node, or an id string)
	// 用 canvas 制造舞台
	function Stage(canvas) {
		if (typeof canvas === 'string') canvas = document.getElementById(canvas);

		// canvas and associated context references
		// 重点：每个舞台自己建一个 ctx
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		// Prevent gestures on stages (scrolling, zooming, etc)
		// 不支持手势滚动/缩放
		this.canvas.style.touchAction = 'none';

		// physics speed multiplier: allows slowing down or speeding up simulation (must be manually implemented in physics layer)
		// 物理层速度【乘数？】，【模拟】仿真变快变慢，必须【手动】在物理层实现
		this.speed = 1;

		// devicePixelRatio alias (should only be used for rendering, physics shouldn't care)
		// dpr 影响只在渲染的时候作用，不应该让物理层管理相关的计算
		// avoids rendering unnecessary pixels that browser might handle natively via CanvasRenderingContext2D.backingStorePixelRatio
		// 避免浏览器可能通过【CanvasRenderingContext2D.backingStorePixelRatio】原生地处理不必要的像素
		this.dpr = Stage.disableHighDPI ? 1 : ((window.devicePixelRatio || 1) / (this.ctx.backingStorePixelRatio || 1));

		// canvas size in DIPs and natural pixels
		this.width = canvas.width;
		this.height = canvas.height;
		this.naturalWidth = this.width * this.dpr;
		this.naturalHeight = this.height * this.dpr;

		// size canvas to match natural size
		// 也就是 dpr !== 1
		if (this.width !== this.naturalWidth) {
			this.canvas.width = this.naturalWidth;
			this.canvas.height = this.naturalHeight;
			this.canvas.style.width = this.width + 'px';
			this.canvas.style.height = this.height + 'px';
		}

		Stage.stages.push(this);

		// event listeners (note that 'ticker' is also an option, for frame events)
		// 所有的事件绑定都应该在这里存放
		this._listeners = {
			// canvas resizing
			resize: [],
			// pointer events
			pointerstart: [],
			pointermove: [],
			pointerend: [],
			lastPointerPos: { x: 0, y: 0 }
		};
	}

	// track all Stage instances
	// 静态方法，存放在函数本身身上，是不是也可以直接用变量存？
	Stage.stages = [];

	// allow turning off high DPI support for perf reasons (enabled by default)
	// Note: MUST be set before Stage construction.
	//       Each stage tracks its own DPI (initialized at construction time), so you can effectively allow some Stages to render high-res graphics but not others.
	Stage.disableHighDPI = false;

	// events
	Stage.prototype.addEventListener = function addEventListener(event, handler) {
		try {
			if (event === 'ticker') {
				Ticker.addListener(handler);
			} else {
				this._listeners[event].push(handler);
			}
		}
		catch (e) {
			throw ('Invalid Event')
		}
	};

	Stage.prototype.dispatchEvent = function dispatchEvent(event, val) {
		const listeners = this._listeners[event];
		if (listeners) {
			listeners.forEach(listener => listener.call(this, val));
		} else {
			throw ('Invalid Event');
		}
	};

	// resize canvas
	Stage.prototype.resize = function resize(w, h) {
		this.width = w;
		this.height = h;
		this.naturalWidth = w * this.dpr;
		this.naturalHeight = h * this.dpr;
		this.canvas.width = this.naturalWidth;
		this.canvas.height = this.naturalHeight;
		this.canvas.style.width = w + 'px';
		this.canvas.style.height = h + 'px';

		this.dispatchEvent('resize');
	};

	// utility function for coordinate space conversion
	Stage.windowToCanvas = function windowToCanvas(canvas, x, y) {
		const bbox = canvas.getBoundingClientRect();
		return {
			x: (x - bbox.left) * (canvas.width / bbox.width),
			y: (y - bbox.top) * (canvas.height / bbox.height)
		};
	};
	// handle interaction
	Stage.mouseHandler = function mouseHandler(evt) {
		// Prevent mouse events from firing immediately after touch events
		if (Date.now() - lastTouchTimestamp < 500) {
			return;
		}

		let type = 'start';
		if (evt.type === 'mousemove') {
			type = 'move';
		} else if (evt.type === 'mouseup') {
			type = 'end';
		}

		Stage.stages.forEach(stage => {
			const pos = Stage.windowToCanvas(stage.canvas, evt.clientX, evt.clientY);
			stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
		});
	};
	Stage.touchHandler = function touchHandler(evt) {
		lastTouchTimestamp = Date.now();

		// Set generic event type
		let type = 'start';
		if (evt.type === 'touchmove') {
			type = 'move';
		} else if (evt.type === 'touchend') {
			type = 'end';
		}

		// Dispatch "pointer events" for all changed touches across all stages.
		Stage.stages.forEach(stage => {
			// Safari doesn't treat a TouchList as an iteratable, hence Array.from()
			for (let touch of Array.from(evt.changedTouches)) {
				let pos;
				if (type !== 'end') {
					pos = Stage.windowToCanvas(stage.canvas, touch.clientX, touch.clientY);
					stage._listeners.lastPointerPos = pos;
					// before touchstart event, fire a move event to better emulate cursor events
					if (type === 'start') stage.pointerEvent('move', pos.x / stage.dpr, pos.y / stage.dpr);
				} else {
					// on touchend, fill in position information based on last known touch location
					pos = stage._listeners.lastPointerPos;
				}
				stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
			}
		});
	};

	// dispatch a normalized pointer event on a specific stage
	Stage.prototype.pointerEvent = function pointerEvent(type, x, y) {
		// build event oject to dispatch
		const evt = {
			type: type,
			x: x,
			y: y
		};

		// whether pointer event was dispatched over canvas element
		evt.onCanvas = (x >= 0 && x <= this.width && y >= 0 && y <= this.height);

		// dispatch
		this.dispatchEvent('pointer' + type, evt);
	};

	document.addEventListener('mousedown', Stage.mouseHandler);
	document.addEventListener('mousemove', Stage.mouseHandler);
	document.addEventListener('mouseup', Stage.mouseHandler);
	document.addEventListener('touchstart', Stage.touchHandler);
	document.addEventListener('touchmove', Stage.touchHandler);
	document.addEventListener('touchend', Stage.touchHandler);


	return Stage;

})(window, document, Ticker);
