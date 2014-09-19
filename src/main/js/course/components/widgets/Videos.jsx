/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

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
		var videos = this.refs.v;
		if (videos) {
			videos = videos.getDOMNode();
			videos.scrollLeft = videos.offsetWidth * active;
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
		e.preventDefault();
		e.stopPropagation();
		var active = this.state.active || 0;
		this.setState({
			active: Math.min(active + 1, this.props.children.length - 1)
		});
	},


	onPrev: function(e) {
		e.preventDefault();
		e.stopPropagation();
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


	render: function() {
		console.debug('Rendered...')
		if (this.state.loading) { return (<Loading/>); }
		if (this.state.error) {	return <Error error={this.state.error}/> }

		return (
			<div className="videos-carousel-container">
				<ul ref="v" className="videos-carousel" tabIndex="0">
					{this.props.children}
				</ul>
				<button className="prev" onClick={this.onPrev}/>
				<button className="next" onClick={this.onNext}/>
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
