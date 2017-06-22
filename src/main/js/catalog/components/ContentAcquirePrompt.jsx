import React from 'react';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';

import Entry from './Entry';

export default class extends React.Component {
	static displayName = 'ContentAcquirePrompt';

	static shouldPrompt (error) {
		const has = x => x && x.length > 0;
		return error.statusCode === 403 && has(error.Items);
	}

	static propTypes = {
		//The note or thing that points to content the user does not have access to.
		relatedItem: PropTypes.object,

		//The 403 response body
		data: PropTypes.object
	};

	state = {};

	componentDidMount () {
		this.resolve();
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.data !== nextProps.data) {
			this.resolve(nextProps);
		}
	}

	resolve = (props = this.props) => {
		let {data = {Items:[]}} = props;
		let items = data.Items.reduce((a, x) => a.concat(x), []);

		getService()
			.then(service =>
				Promise.all(items.map(x =>
					service.getObject(x))))
			.then(o => this.setState({items: o}));
	};

	render () {
		let {items = []} = this.state;
		let {length} = items;

		return (
			<div className="missing-content content-aquire-prompt">
				{length === 1 ? (
					<div>
						<h3>You do not have access to this course.</h3>
						<h5>Enroll now:</h5>
					</div>
				) : (
					<div>
						<h3>You do not have access to this content.</h3>
						{length > 0 && ( <h4>Enroll in one of these courses to gain access:</h4> )}
					</div>
				)}
				<ul className="catalog-entries">
					{items.map(x => (
						<Entry item={x} key={x.getID()}/>
					))}
				</ul>
			</div>
		);
	}
}
