import React from 'react';

export default React.createClass({
	displayName: 'Pie',

	propTypes: {
		title: React.PropTypes.string,
		colors: React.PropTypes.arrayOf(React.PropTypes.string),
		pixelDensity: React.PropTypes.number,
		series: React.PropTypes.arrayOf(React.PropTypes.object)
	},

	getDefaultProps  () {
		return {
			title: '',
			colors: ['#40b450', /*'#b8b8b8',*/ '#3fb3f6', '#F35252'],
			pixelDensity: (global.devicePixelRatio || 1) * 2,
			series: [
				{value: 12, label: 'foo'},
				{value: 30, label: 'bar'},
				{value: 23, label: 'baz'}
			]
		};
	},


	getCanvas () {
		return this.refs.canvas;
	},


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


	getTotal  () {
		return this.props.series.reduce((sum, i) => sum + i.value, 0);
	},


	render () {
		let p = this.props;
		let colors = p.colors;
		let data = p.series;
		let total = this.getTotal();
		let width = p.width * p.pixelDensity;
		let height = p.height * p.pixelDensity;
		let style = {
			width: p.width,
			height: p.height
		};

		return (
			<div>
				<canvas ref="canvas" style={style} width={width} height={height} />
				<div className="label title">{p.title}</div>
				<ul className="legend">
				{data.map((item, i) => {
					return (
						<li className="series label"
							key={item.label}
							data-value={item.value}
							style={{color: colors[i % colors.length]}}>
							{item.label}
						</li>
					);
				})}
					<li className="total label">Total: {total}</li>
				</ul>
			</div>
		);
	},


	paint (ctx) {
		let centerX = ctx.canvas.width / 2,
			centerY = ctx.canvas.height / 2 - 10,
			len = this.props.series.length, i = 0;

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

			for (i; i < len; i++) {
				this.drawSegment(ctx, i);
			}


		} finally {
			ctx.restore();
		}
	},


	drawSegment (ctx, i) {
		let radius = Math.floor(ctx.canvas.width / 4),
			series = this.props.series[i].value,
			total = this.getTotal(),

			percent = series / total,

			startingAngle = percentToRadians(sumTo(this.props.series, i) / total),

			arcSize = percentToRadians(percent),

			endingAngle = startingAngle + arcSize,
			endingRadius = radius * 0.5;

		ctx.save();

		ctx.beginPath();

		ctx.moveTo(endingRadius * Math.cos(startingAngle),
					endingRadius * Math.sin(startingAngle));

		ctx.arc(0, 0, radius, startingAngle, endingAngle, false);
		ctx.arc(0, 0, radius * 0.5, endingAngle, startingAngle, true);

		ctx.closePath();

		ctx.fillStyle = this.props.colors[i % this.props.colors.length];
		ctx.fill();

		ctx.lineWidth = 5;
		ctx.globalCompositeOperation = 'destination-out';
		ctx.strokeStyle = '#000';
		ctx.stroke();

		ctx.restore();
	}
});


function sumTo (data, i) {
	let sum = 0, j = 0;
	for (j; j < i; j++) {
		sum += data[j].value;
	}
	return sum;
}

function percentToRadians (percent) { return ((percent * 360) * Math.PI) / 180; }
