import React from 'react';
import PropTypes from 'prop-types';
import { getService } from '@nti/web-client';

import DisplayName from './DisplayName';

export default class extends React.Component {
	static displayName = 'RepliedTo';

	static propTypes = {
		item: PropTypes.object,
	};

	componentDidMount() {
		this.fill();
	}

	componentDidUpdate(props) {
		if (this.props.item !== props.item) {
			this.fill();
		}
	}

	fill = (props = this.props) => {
		let { item } = props;

		getService()
			.then(s => s.getObject(item.inReplyTo, { field: 'Creator' }))
			.catch(() => 'Unknown')
			.then(o => this.setState({ parentObjectsCreator: o }));
	};

	render() {
		let { item } = this.props;
		let { parentObjectsCreator } = this.state || {};

		if (!item || !parentObjectsCreator) {
			return null;
		}

		return (
			<div>
				<DisplayName entity={item.creator} />
				<span> replied to </span>
				{typeof parentObjectsCreator === 'string' ? (
					parentObjectsCreator
				) : (
					<DisplayName entity={parentObjectsCreator} />
				)}
			</div>
		);
	}
}
