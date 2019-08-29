import React from 'react';
import PropTypes from 'prop-types';

//See http://jsfiddle.net/jsg2021/6yfw8/ for a demo
export default class GradePerformance extends React.Component {

	static propTypes = {
		averageColor: PropTypes.string,
		averageWidth: PropTypes.number,
		gradeColor: PropTypes.string,
		gradeWidth: PropTypes.number,
		store: PropTypes.arrayOf(PropTypes.object),
		topMargin: PropTypes.number,
		bottomMargin: PropTypes.number,
		pixelDensity: PropTypes.number,

		width: PropTypes.number,
		height: PropTypes.number

	}

	static defaultProps = {
		averageColor: '#b8b8b8',
		averageWidth: 3,
		gradeColor: '#40b450',
		gradeWidth: 4,
		store: null,
		topMargin: 30,
		bottomMargin: 10,
		pixelDensity: (global.devicePixelRatio || 1) * 2
	}

	state = {
		dashOffset: 0,
		canAnimate: this.testAnimationProperties()
	}


	attachRef = x => this.canvas = x

	componentDidMount () {
		const {canvas} = this;
		let context = canvas.getContext('2d');

		canvas.width = this.props.width * this.props.pixelDensity;
		canvas.height = this.props.height * this.props.pixelDensity;

		context.imageSmoothingEnabled = true;

		Object.assign(this, {
			canvasContext: context,
			animateTask: {
				run: this.redraw,
				interval: 50,
				start () {
					if (this.id) {
						return;
					}
					this.id = setInterval(this.run, this.interval);
				},

				stop () {
					clearInterval(this.id);
					delete this.id;
				}
			}
		});


		if (!context.setLineDash) {
			context.setLineDash = () => {};
		}

		this.paint(context);
	}

	componentDidUpdate () {
		let ctx = this.canvasContext;
		if (ctx) {
			this.paint(ctx);
		}
	}

	componentWillUnmount () {
		this.stopAnimation();
	}

	render () {
		let p = this.props;
		let width = p.width * p.pixelDensity;
		let height = p.height * p.pixelDensity;
		let style = {
			width: p.width,
			height: p.height
		};

		return (
			<canvas ref={this.attachRef} {...this.props} className="grade" style={style} width={width} height={height} />
		);
	}

	testAnimationProperties = () => {
		const has = (x, k) => Object.prototype.hasOwnProperty.call(x, k);

		if (this.state && has(this.state, 'canAnimate')) {
			return this.state.canAnimate;
		}

		let ctx = document.createElement('canvas').getContext('2d'),
			hasDashOffset = has(ctx, 'lineDashOffset') || has(ctx, 'mozDashOffset'),
			hasSetLineDash = !!ctx.setLineDash;

		return hasDashOffset && hasSetLineDash;
	}

	startAnimation = () => {
		let canAnimate = this.testAnimationProperties();
		if (canAnimate) {
			this.animateTask.start();//safe to call repeatedly (will noop if already started)
		}
	}

	stopAnimation = () => {
		if (this.animateTask) {
			this.animateTask.stop();
		}
	}

	repaint = () => {
		let {dashOffset = 0} = this.state || {};

		dashOffset--;

		this.setState({dashOffset});
	}

	paint = (ctx) => {
		if (!ctx) { return; }

		ctx.canvas.width += 0; //set the canvas dirty and make it clear on next draw.
		this.drawAverages(ctx);
		this.drawGrades(ctx);
	}

	drawAverages = (ctx) => {

		ctx.save();
		try {
			ctx.lineDashOffset = this.state.dashOffset;
			ctx.mozDashOffset = this.state.dashOffset;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.beginPath();
			ctx.setLineDash([10, 4]);
			ctx.strokeStyle = this.props.averageColor;
			ctx.lineWidth = this.props.averageWidth;

			//ctx.shadowColor = '#ccc';
			//ctx.shadowBlur = 5;
			//ctx.shadowOffsetX = 1;
			//ctx.shadowOffsetY = 1;
			this.drawLine(ctx, 'AverageGrade');
		} finally {
			ctx.restore();
		}
	}

	drawGrades = (ctx) => {
		ctx.save();
		try {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.beginPath();
			ctx.strokeStyle = this.props.gradeColor;
			ctx.lineWidth = this.props.gradeWidth;

			//ctx.shadowColor = '#666';
			//ctx.shadowBlur = 5;
			//ctx.shadowOffsetX = 1;
			//ctx.shadowOffsetY = 2;
			this.drawLine(ctx, 'Grade');
		} finally {
			ctx.restore();
		}
	}

	drawLine = (ctx, property) => {
		if (!this.store || !this.store.length) {
			this.stopAnimation();
			return;
		}

		let pointDistance = (ctx.canvas.width / (this.store.length - 1)),
			t = this.props.topMargin * this.props.pixelDensity,
			h = ctx.canvas.height - (t + (this.props.bottomMargin * this.props.pixelDensity)),
			currentX = 0;

		ctx.translate(0, t);

		this.store.forEach((rec, x) => {
			let y = ((rec[property] || 0) / 100) * h;
			ctx[x === 0 ? 'moveTo' : 'lineTo'](currentX, y);
			currentX += pointDistance;
		});

		ctx.stroke();
	}
}
