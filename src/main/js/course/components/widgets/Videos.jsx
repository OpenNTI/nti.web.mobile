/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var merge = require('react/lib/merge');

var toArray = require('dataserverinterface/utils/toarray');


var Error = require('common/components/Error');
var Loading = require('common/components/Loading');

module.exports = React.createClass({
	displayName: 'CourseOverviewVideos',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideoset/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	getInitialState: function() {
		return {
			loading: true,
			error: false
		};
	},


	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		//Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	componentDidUpdate: function() {
		var active = this.state.active || 0;
		var touch = this.state.touch;
		var videos = this.refs.v;
		if (videos) {

			if (touch) {
				touch = touch.delta;
			} else {
				touch = 0;
			}

			videos = videos.getDOMNode();
			videos.scrollLeft = (videos.offsetWidth * active) + touch;
		}
	},


	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded: function(props) {
		try {
			this.setState(this.getInitialState());
			props.course.getVideoIndex()
				.then(function(data) {
					this.setState({
						loading: false,
						data: data
					})
				}.bind(this))
				.catch(this.__onError);
		}
		catch(e) {
			this.__onError(e);
		}
	},


	onNext: function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		var active = this.state.active || 0;
		this.setState({
			active: Math.min(active + 1, this.props.children.length - 1)
		});
	},


	onPrev: function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		var active = this.state.active || 0;
		this.setState({
			active: Math.max(active - 1, 0)
		});
	},


	onActivateSlide: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var newActive = parseInt(e.target.getAttribute('data-index'), 10);
		this.setState({
			active: newActive
		});
	},


	onTouchStart: function(e) {
		var touch = event.targetTouches[0];

		// If there's exactly one finger inside this element
		if (event.targetTouches.length == 1) {
			this.setState({
				touch: {
					id: touch.identifier,
					x: touch.pageX,
					delta: 0
				}
			});
		}
	},


	onTouchMove: function(e) {
		e.preventDefault();
		function find(t, i) {
			return t || (i.identifier === this.state.touch.id && i); }

		var touch = toArray(e.targetTouches)
						.reduce(find.bind(this), null);

		if (touch) {
			this.setState({
				touch: merge(this.state.touch, {
					delta: this.state.touch.x - touch.pageX
				})
			});
		}
	},


	onTouchEnd: function(e) {
		var videos = this.refs.v;
		var active = this.state.active || 0;
		var touch = this.state.touch || {};
		var threshold = 0;
		if (videos) {
			videos = videos.getDOMNode();
			threshold = videos.offsetWidth / 2;

			if (Math.abs(touch.delta) > threshold) {
				this[touch.delta > 0 ? 'onNext' : 'onPrev']();
			}
		}

		this.setState({ touch: null	});
	},


	render: function() {
		if (this.state.loading) { return (<Loading/>); }
		if (this.state.error) {	return <Error error={this.state.error}/> }

		return (
			<div className="videos-carousel-container">
				<ul ref="v" className="videos-carousel"
				 	onTouchStart={this.onTouchStart}
					onTouchMove={this.onTouchMove}
					onTouchEnd={this.onTouchEnd}
					tabIndex="0">
					{this.props.children}
				</ul>
				<button className="prev fi-arrow-left" onClick={this.onPrev} title="Prevous Video"/>
				<button className="next fi-arrow-right" onClick={this.onNext} title="Next Video"/>
				<ul className="videos-carousel-dots">
					{this._renderDots()}
				</ul>
			</div>
		);
	},


	_renderDots: function() {
		return this.props.children.map(function(_, i) {
			var active = (i === (this.state.active || 0)) ? 'active' : null;
			return (<li><a className={active} href={"#"+i}
				onClick={this.onActivateSlide} data-index={i}/></li>);
		}.bind(this));
	}
});
