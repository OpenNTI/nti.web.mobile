import React from 'react';

export default React.createClass( {
	displayName: 'Grade',

	propTypes: {
		/**
		 * Specifying a singular color will result in drawing only one segment.
		 * Adding a second color will make this draw the second segment.
		 *
		 * @type {String/Array[String]} The color to fill the segment(s) with
		 */
		color: React.PropTypes.oneOfType([
			//Draw only one segement
			React.PropTypes.string,
			//Draw both segments
			React.PropTypes.arrayOf(React.PropTypes.string)
		]),

		/**
		 * Optional stroke color.
		 *
		 * @type {string}
		 */
		strokeColor: React.PropTypes.string,

		/**
		 * The Value to chart.
		 *
		 * @type {number} Default: 90
		 */
		grade: React.PropTypes.number.isRequired,

		/**
		 * Width of the graph
		 *
		 * @type {number} Default: 200
		 */
		width: React.PropTypes.number,

		/**
		 * Height of the graph
		 * @type {number} Default: 200
		 */
		height: React.PropTypes.number,

		/**
		 * The pixel density to render at.
		 *
		 * @type {number} Default: 2
		 */
		pixelDensity: React.PropTypes.number,


		withLetter: React.PropTypes.bool
	},


	getDefaultProps () {
		return {
			grade: 90,
			color: '#40b450',//#a5c959
			pixelDensity: (global.devicePixelRatio || 1) * 2,
			width: 200,
			height: 200
		};
	},


	componentDidMount () {
		let canvas = React.findDOMNode(this);
		let context = canvas.getContext('2d');

		context.imageSmoothingEnabled = true;

		this.paint(context);
	},


	componentDidUpdate () {
		let context = React.findDOMNode(this).getContext('2d');
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
			<canvas {...this.props} className="grade" style={style} width={width} height={height} />
		);
	},


	paint (context) {
		context.canvas.width += 0; //set the canvas dirty and make it clear on next draw.

		this.drawCircle(context);
		if (this.props.withLetter) {
			this.drawDot(context);
		}
	},


	getColor () {
		let c = this.props.color;
		if (Array.isArray(c)) {
			c = c[0];
		}
		return c;
	},


	getSecondaryColor () {
		let c = this.props.color;
		if (!Array.isArray(c)) {
			c = [];
		}
		return c[1];
	},


	drawCircle (ctx) {
		let node = ctx.canvas,
			stroke = node.width * (1 / 112),
			centerX = node.width / 2,
			centerY = node.height / 2,
			radius = node.width / 4,
			textbox,
			grade = (this.props.grade || 0).toString(10),
			font = {
				size: Math.floor(radius * 0.8),
				weight: '300'
			};

		ctx.save();
		try {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.translate(centerX, centerY);
			ctx.rotate(-Math.PI / 2);
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, (2 * Math.PI) * (grade / 100), false);
			ctx.lineWidth = stroke;
			ctx.fillStyle = this.getColor();
			ctx.strokeStyle = this.props.strokeColor || this.getColor();

			//ctx.shadowColor = '#ddd';
			//ctx.shadowBlur = 5;
			//ctx.shadowOffsetX = 1;
			//ctx.shadowOffsetY = 1;

			ctx.stroke();

			ctx.lineWidth = 0;
			ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			setFont(ctx, font);
			textbox = ctx.measureText(grade);
			ctx.globalAlpha = 0.8;
			ctx.fillText(grade, -textbox.width / 2, font.size / 3);

			font.size /= 3;
			font.weight = '700';
			setFont(ctx, font);
			ctx.fillText('%', textbox.width / 2, -font.size / 4);
		} finally {
			ctx.restore();
		}
	},


	drawDot (ctx) {
		let node = ctx.canvas,
			slope = node.height / node.width,
			centerY = (node.height / 2) + (node.width / 4),
			centerX = centerY / slope,
			radius = Math.floor(node.width * 0.09),
			textbox,
			grade = getGradeLetter(this.props.grade),
			nudge = this.props.pixelDensity,
			font = {
				size: Math.floor(radius),
				weight: 'bold'
			};

		ctx.save();
		try {

			ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);

			//ctx.shadowColor = '#666';
			//ctx.shadowBlur = 5;
			//ctx.shadowOffsetX = 1;
			//ctx.shadowOffsetY = 1;

			ctx.fillStyle = this.getColor();
			ctx.fill();

			ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			ctx.fillStyle = '#fff';

			setFont(ctx, font);
			textbox = ctx.measureText(grade);

			//ctx.shadowOffsetX = -1;
			//ctx.shadowOffsetY = -1;

			ctx.fillText(grade, Math.floor(-textbox.width / 2) + nudge, font.size / 3);
		} finally {
			ctx.restore();
		}
	}
});


function setFont (context, font) {
	context.font = [
		font.style || 'normal',
		font.variant || 'normal',
		font.weight || 'normal', (font.size || 10) + 'px',
		font.family || '"Open Sans"'
	].join(' ');
}

function getGradeLetter (g) {
	if (g >= 90) {
		g = 'A';
	} else if (g >= 80) {
		g = 'B';
	} else if (g >= 70) {
		g = 'C';
	} else if (g >= 60) {
		g = 'D';
	} else {
		g = 'F';
	}

	return g;
}
