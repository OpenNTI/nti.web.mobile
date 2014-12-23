/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

//See http://jsfiddle.net/jsg2021/6yfw8/ for a demo
module.exports = React.createClass( {

	propTypes: {
		averageColor: React.PropTypes.string,
		averageWidth: React.PropTypes.number,
		gradeColor: React.PropTypes.string,
		gradeWidth: React.PropTypes.number,
		store: React.PropTypes.arrayOf(React.PropTypes.object),
		topMargin: React.PropTypes.number,
		bottomMargin: React.PropTypes.number,
		pixelDensity: React.PropTypes.number
	},


	getDefaultProps: function () {
		return {
			averageColor: '#b8b8b8',
			averageWidth: 3,
			gradeColor: '#40b450',
			gradeWidth: 4,
			store: null,
			topMargin: 30,
			bottomMargin: 10,
			pixelDensity: 2
		};
	},


	getInitialState: function () {
		return {
			dashOffset: 0,
			canAnimate: this.testAnimationProperties()
		};
	},


	componentDidMount: function() {
		var canvas = this.getDOMNode();
		var context = canvas.getContext('2d');

		canvas.width = this.props.width * this.props.pixelDensity;
		canvas.height = this.props.height * this.props.pixelDensity;

		context.imageSmoothingEnabled = true;

		this.setState({
			context: context,
			animateTask: {
				run: this.redraw,
				interval: 50,
				start: function() {
					if (this._id) {
						return;
					}
					this._id = setInterval(this.run, this.interval);
				},

				stop: function () {
					clearInterval(this._id);
					delete this._id;
				}
			}
		});


		if (!context.setLineDash) {
			context.setLineDash = function() {};
		}

		this.paint(context);
	},


	componentDidUpdate: function() {
		this.paint(this.state.context);
	},


	componentWillUnmount: function () {
		this.stopAnimation();
	},


	render: function() {
		var p = this.props;
		var width = p.width * p.pixelDensity;
		var height = p.height * p.pixelDensity;
		var style = {
			width: p.width,
			height: p.height
		};

		return (
			<canvas {...this.props} className="grade" style={style} width={width} height={height} />
		);
	},


	testAnimationProperties: function() {
		if (this.state && this.state.hasOwnProperty('canAnimate')) {
			return this.state.canAnimate;
		}

		var ctx = document.createElement('canvas').getContext('2d'),
			hasDashOffset = ctx.hasOwnProperty('lineDashOffset') || ctx.hasOwnProperty('mozDashOffset'),
			hasSetLineDash = !!ctx.setLineDash;

		return hasDashOffset && hasSetLineDash;
	},


	startAnimation: function() {
		var canAnimate = this.testAnimationProperties();
		if (canAnimate && this.isMounted()) {
			this.state.animateTask.start();//safe to call repeatedly (will noop if already started)
		}
	},


	stopAnimation: function() {
		if (this.state && this.state.animateTask) {
			this.state.animateTask.stop();
		}
	},


	repaint: function() {
		var next = this.state && (this.state.dashOffset - 1);
		this.setState({
			dashOffset: next || 0
		});
	},


	paint: function(ctx) {
		if (!ctx) {return;}

		ctx.canvas.width += 0; //set the canvas dirty and make it clear on next draw.
		this.drawAverages(ctx);
		this.drawGrades(ctx);
	},


	drawAverages: function(ctx) {

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
	},


	drawGrades: function(ctx) {
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
	},


	drawLine: function(ctx, property) {
		if (!this.store || !this.store.length) {
			this.stopAnimation();
			console.warn('No data for chart:', this.id);
			return;
		}

		var pointDistance = (ctx.canvas.width / (this.store.length - 1)),
			t = this.props.topMargin * this.props.pixelDensity,
			h = ctx.canvas.height - (t + (this.props.bottomMargin * this.props.pixelDensity)),
			currentX = 0;

		ctx.translate(0, t);

		this.store.forEach(function(rec, x) {
			var y = ((rec[property] || 0) / 100) * h;
			ctx[x === 0 ? 'moveTo' : 'lineTo'](currentX, y);
			currentX += pointDistance;
		});

		ctx.stroke();
	}

});
