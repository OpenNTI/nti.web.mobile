/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Score',

	propTypes: {
		title: React.PropTypes.string,
		colors: React.PropTypes.arrayOf(React.PropTypes.string),
		pixelDensity: React.PropTypes.number,
		score: React.PropTypes.number
	},

	getDefaultProps: function () {
		return {
			title: '',
			colors: ['#40b450', '#b8b8b8'],
			pixelDensity: 2,
			score: 90
		};
	},


	getInitialState: function (argument) {
		var score = parseInt(this.props.score, 10);
		return {
			series: [
				{value: score, label: 'Score'},
				{value: 100 - score, label: ''}
			]
		};
	},


	getCanvas: function() {
		return this.getDOMNode();
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


	render: function() {
		var p = this.props;
		var colors = p.colors;
		var width = p.width * p.pixelDensity;
		var height = p.height * p.pixelDensity;
		var style = {
			width: p.width,
			height: p.height
		};

		return (
			<canvas style={style} width={width} height={height} />
		);
	},


	paint: function(ctx) {
		var centerX = ctx.canvas.width / 2,
			centerY = ctx.canvas.height / 2,
			len = this.state.series.length, i = 0;

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

			for (i; i < len; i++) {
				this.drawSegment(ctx, i);
			}

			this.drawLabel(ctx);

		} finally {
			ctx.restore();
		}
	},


	getTotal: function () {
		return this.state.series.reduce(function (sum, i) {
			return sum + i.value; }, 0);
	},


	drawSegment: function(ctx, i) {
		var radius = Math.floor(ctx.canvas.width / 2),
			series = this.state.series[i].value,
			total = this.getTotal(),

			percent = series / total,

			startingAngle = percentToRadians(sumTo(this.state.series, i) / total),

			arcSize = percentToRadians(percent),

			endingAngle = startingAngle + arcSize,
			endingRadius = radius * 0.75;

		ctx.save();

		ctx.beginPath();

		ctx.moveTo(endingRadius * Math.cos(startingAngle),
					endingRadius * Math.sin(startingAngle));

		ctx.arc(0, 0, radius, startingAngle, endingAngle, false);
		ctx.arc(0, 0, endingRadius, endingAngle, startingAngle, true);

		ctx.closePath();

		ctx.fillStyle = this.props.colors[i % this.props.colors.length];
		ctx.fill();

		ctx.lineWidth = 5;
		ctx.globalCompositeOperation = 'destination-out';
		ctx.strokeStyle = '#000';
		ctx.stroke();

		ctx.restore();
	},


	drawLabel: function(ctx) {
		try {
			var centerX = ctx.canvas.width / 2,
				centerY = ctx.canvas.height / 2,
				radius = Math.floor(ctx.canvas.width / 2) *.75,
				textbox,
				score = parseInt(this.props.score, 10),
				font = {
					size: Math.floor(radius),
					weight: 'normal'
				};

			ctx.save();

			ctx.fillStyle = this.props.colors[score ? 0 : 1];
			ctx.lineWidth = 0;
			ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			setFont(ctx, font);

			textbox = ctx.measureText(score);
			ctx.globalAlpha = 0.8;
			ctx.fillText(score, -textbox.width / 2, font.size / 3);

			font.size /= 3;
			font.weight = '700';
			setFont(ctx, font);
			ctx.fillText('%', textbox.width / 2, -font.size / 4);
		}
		finally {
			ctx.restore();
		}
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


function setFont(context, font) {
	context.font = [
		font.style || 'normal',
		font.variant || 'normal',
		font.weight || 'normal', (font.size || 10) + 'px',
		font.family || '"Open Sans"'
	].join(' ');
}
