import React from 'react';
import Highlight from './Highlight';
import Breadcrumb from './Breadcrumb';
import {getThumbnail} from '../../Api';

export default React.createClass({
	displayName: 'HighlightGroup',

	propTypes: {
		ntiid: React.PropTypes.string.isRequired,
		items: React.PropTypes.array.isRequired
	},

	getInitialState: function() {
		return {
		};
	},

	componentDidMount: function() {
		this.load();
	},

	componentWillReceiveProps: function(nextProps) {
		this.load(nextProps);
	},

	load(props=this.props) {
		let {items} = props;
		if (items && items.length > 0) {
			getThumbnail(items[0])
			.then(thumb => {
				this.setState({
					thumb
				});
			});
		}
	},

	render () {

		if (!this.props.items || this.props.items.length === 0) {
			return null;
		}

		return (
			<div className="highlight-group">
				{this.state.thumb && <img src={this.state.thumb} />}
				{this.props.items.length > 0 && <Breadcrumb item={this.props.items[0]} />}
				{
					this.props.items.map((item, index) => <Highlight item={item} key={'highlight' + index} />)
				}
			</div>
		);
	}
});
