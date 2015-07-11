import React from 'react';
import {getThumbnail} from '../../Api';

export default React.createClass({
	displayName: 'ContentIcon',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		this.load();
	},

	componentWillReceiveProps (nextProps) {
		this.load(nextProps);
	},

	load(props=this.props) {
		let {item} = props;
		if (item) {
			getThumbnail(item)
				.then(src => this.setState({ src }))
				.catch(() => ({/*console.warn(e)*/}));
		}
		else {
			this.setState({ src: null });
		}
	},

	render () {
		let {src} = this.state;

		return !src ? null : (
			<img src={src} />
		);
	}
});
