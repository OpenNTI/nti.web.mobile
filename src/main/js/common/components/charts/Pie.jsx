'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Pie',

	propTypes: {
		title: React.PropTypes.string,
		colors: React.PropTypes.arrayOf(React.PropTypes.string),
		pixelDensity: React.PropTypes.number,
		series: React.PropTypes.arrayOf(React.PropTypes.object)
	},

	getDefaultProps: function () {
		return {
			title: '',
			colors: ['#40b450', /*'#b8b8b8',*/ '#3fb3f6', '#F35252'],
			pixelDensity: 2,
			series: [
				{value: 12, label: 'foo'},
				{value: 30, label: 'bar'},
				{value: 23, label: 'baz'}
			]
		};
	},


	getCanvas: function() {
		return this.refs.canvas.getDOMNode();
	},


	componentDidMount: function() {
		var canvas = this.getCanvas();
		var context = canvas.getContext('2d');

		context.imageSmoothingEnabled = true;

		this.paint(context);
	},


	componentDidUpdate: function() {
		var context = this.getCanvas().getContext('2d');
		this.paint(context);
	},


	getTotal: function () {
		return this.props.series.reduce(function(sum, i){return sum + i.value;}, 0);
	},


	render: function() {
		var p = this.props;
		var colors = p.colors;
		var data = p.series;
		var total = this.getTotal();
		var width = p.width * p.pixelDensity;
		var height = p.height * p.pixelDensity;
		var style = {
			width: p.width,
			height: p.height
		};

		return (
			<div>
				<canvas ref="canvas" style={style} width={width} height={height} />
				<div className="label title">{p.title}</div>
				<ul className="legend">
				{data.map(function(item, i){
					var style = {color: colors[i % colors.length]};
					return (
						<li className="series label"
							key={item.label}
							data-value={item.value}
							style={style}>
							{item.label}
						</li>
					);
				})}
					<li className="total label">Total: {total}</li>
				</ul>
			</div>
		);
	},


	paint: function(ctx) {
		var centerX = ctx.canvas.width / 2,
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


	drawSegment: function(ctx, i) {
		var radius = Math.floor(ctx.canvas.width / 4),
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


function sumTo(data, i) {
	var sum = 0, j = 0;
	for (j; j < i; j++) {
		sum += data[j].value;
	}
	return sum;
}

function percentToRadians(percent) { return ((percent * 360) * Math.PI) / 180; }
