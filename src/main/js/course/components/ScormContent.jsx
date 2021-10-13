import './ScormContent.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { Scorm } from '@nti/web-course';

import { Component as ContextSender } from '../../common/mixins/ContextSender';

export default class ScormContent extends Component {
	static propTypes = {
		course: PropTypes.object,
	};

	render() {
		const { course } = this.props;
		return (
			<div className="scorm-content">
				<ContextSender getContext={getContext} {...this.props} />
				<Scorm bundle={course} />
			</div>
		);
	}
}

async function getContext() {
	const context = this;
	const { rootId } = context.props;

	return {
		label: 'Content',
		href: context.makeHref(rootId + '/scorm-content/'),
	};
}
