import React from 'react';

export default React.createClass({
	displayName: 'Score',

	propTypes: {
		title: React.PropTypes.string,
		colors: React.PropTypes.arrayOf(React.PropTypes.string),
		pixelDensity: React.PropTypes.number,
		score: React.PropTypes.number,
		inlinePercent: React.PropTypes.bool
	},

	getDefaultProps () {
		return {
			inlinePercent: true,
			title: '',
			colors: ['#40b450', '#b8b8b8'],
			pixelDensity: (global.devicePixelRatio || 1) * 2,
			score: 90
		};
	},


	getInitialState () {
		return {
			series: []
		};
	},


	getCanvas () {
		return React.findDOMNode(this);
	},


	updateSeries (props = this.props) {
		let score = Math.max(0, Math.min(100, parseInt(props.score, 10)));

		this.setState({
			score,
			series: [
				{value: score, label: 'Score'},
				{value: 100 - score, label: ''}
			]
		});
	},


	componentWillMount () { this.updateSeries(); },
	componentWillReceiveProps (nextProps) { this.updateSeries(nextProps); },


	componentDidMount () {
		let canvas = this.getCanvas();
		let context = canvas.getContext('2d');

		context.imageSmoothingEnabled = true;

		this.paint(context);
	},


	componentDidUpdate () {
		let context = this.getCanvas().getContext('2d');
		this.paint(context);
	},


	render () {
		let p = this.props;
		let width = p.width * p.pixelDensity;
		let height = p.height * p.pixelDensity;
		let style = {
			width: p.width,
			height: p.height
		};

		return (
			<canvas style={style} width={width} height={height} />
		);
	},


	paint (ctx) {
		let centerX = ctx.canvas.width / 2;
		let centerY = ctx.canvas.height / 2;
		let {length} = this.state.series;

		ctx.canvas.width += 0; //set the canvas dirty and make it clear on next draw.

		ctx.save();
		try {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.translate(centerX, centerY);
			ctx.rotate(-Math.PI / 2);

			/*
			ctx.shadowColor = '#ddd';
			ctx.shadowBlur = 5;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			*/

			for (let i = 0; i < length; i++) {
				this.drawSegment(ctx, i);
			}

			this.drawLabel(ctx);

		} finally {
			ctx.restore();
		}
	},


	getTotal () {
		return this.state.series.reduce((sum, i) => sum + i.value, 0);
	},


	getRadius (ctx) {
		let {width, height} = ctx.canvas;
		let leg = Math.min(width, height) + this.getStrokeWidth();

		return Math.ceil(leg / 2);
	},


	getStrokeWidth () {
		let {pixelDensity} = this.props;
		return 3 * pixelDensity;
	},


	drawSegment (ctx, i) {
		let {series} = this.state;
		let radius = this.getRadius(ctx);
		let {value} = series[i];
		let total = this.getTotal();

		let percent = value / total;

		let startingAngle = percentToRadians(sumTo(series, i) / total);

		let arcSize = percentToRadians(percent);

		let endingAngle = startingAngle + arcSize;
		let endingRadius = radius * 0.7;

		ctx.save();

		ctx.beginPath();

		ctx.moveTo(endingRadius * Math.cos(startingAngle),
					endingRadius * Math.sin(startingAngle));

		ctx.arc(0, 0, radius, startingAngle, endingAngle, false);
		ctx.arc(0, 0, endingRadius, endingAngle, startingAngle, true);

		ctx.closePath();

		ctx.fillStyle = this.props.colors[i % this.props.colors.length];
		ctx.fill();

		ctx.lineWidth = this.getStrokeWidth();
		ctx.globalCompositeOperation = 'destination-out';
		ctx.strokeStyle = '#000';
		ctx.stroke();

		ctx.restore();
	},


	drawLabel (ctx) {
		const draw = (text, f, ...xy) => {
			ctx.save();
			setFont(ctx, f);

			//stroke out
			ctx.save();
			ctx.lineWidth = this.getStrokeWidth();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.strokeText(text, ...xy);
			ctx.fillText(text, ...xy);
			ctx.restore();

			ctx.fillText(text, ...xy);
			ctx.restore();
		};

		const measureText = (text, f) => {
			try {
				ctx.save();
				setFont(ctx, f);
				return ctx.measureText(text);
			} finally {
				ctx.restore();
			}
		};

		try {
			let {inlinePercent} = this.props;
			let {score} = this.state;
			let {width, height} = ctx.canvas;
			let centerX = width / 2;
			let centerY = height / 2;
			let radius = this.getRadius(ctx) * 0.68;
			let font = { size: Math.floor(radius), weight: '600' };
			let percent = { size: font.size * 0.6, weight: '700' };

			ctx.save();

			ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			ctx.fillStyle = this.props.colors[score ? 0 : 1];
			ctx.lineWidth = 0;

			if (inlinePercent) {
				score = `${score}%`;
			} else {
				centerX -= (measureText('%', percent).width / 2);
				ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			}

			let textbox = measureText(score, font);
			let xy = [-textbox.width / 2, font.size / 3];
			ctx.globalAlpha = 0.8;
			draw(score, font, ...xy);

			if (!inlinePercent) {
				xy = [textbox.width / 2, 0];
				draw('%', percent, ...xy);
			}
		}
		finally {
			ctx.restore();
		}
	}
});


function sumTo(data, i) {
	let sum = 0, j = 0;
	for (j; j < i; j++) {
		sum += data[j].value;
	}
	return sum;
}

function percentToRadians(percent) { return ((percent * 360) * Math.PI) / 180; }


function setFont(context, font) {
	context.font = [
		font.style || 'normal',
		font.variant || 'normal',
		font.weight || 'normal',
		(font.size || 10) + 'px',
		font.family || '"Open Sans"'
	].join(' ');
}
