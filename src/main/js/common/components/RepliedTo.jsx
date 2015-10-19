import React from 'react';

import DisplayName from './DisplayName';

import {getService} from '../utils';

export default React.createClass({
	displayName: 'RepliedTo',

	propTypes: {
		item: React.PropTypes.object
	},


	componentDidMount () {
		this.fill();
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.fill(nextProps);
		}
	},


	fill (props = this.props) {
		let {item} = props;

		getService()
			.then(s => s.getParsedObject(item.inReplyTo, void 0, 'Creator'))
			.catch(() => 'Unknown')
			.then(o => this.setState({parentObjectsCreator: o}));
	},


	render () {
		let {item} = this.props;
		let {parentObjectsCreator} = this.state || {};

		if (!item || !parentObjectsCreator) {
			return null;
		}

		return (
			<div>
				<DisplayName entity={item.creator}/>
				<span> replied to </span>
				{typeof parentObjectsCreator === 'string'
					? parentObjectsCreator
					: ( <DisplayName entity={parentObjectsCreator}/> )}
			</div>
		);
	}
});
