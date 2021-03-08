import React from 'react';
import PropTypes from 'prop-types';

import Page from 'internal/common/components/Page';

import NavigationTabs from './NavigationTabs';

export default class extends React.Component {
	static displayName = 'course:Page';

	static propTypes = {
		children: PropTypes.any,

		course: PropTypes.object.isRequired,
	};

	render() {
		const { children, course, ...otherProps } = this.props;

		return (
			<>
				<NavigationTabs course={course} exclude={['activity']} />
				<Page {...otherProps} course={course} useCommonTabs>
					{React.Children.map(children, x => React.cloneElement(x))}
				</Page>
			</>
		);
	}
}
