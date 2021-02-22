import React from 'react';
import PropTypes from 'prop-types';

import Page from 'common/components/Page';

import NavigationTabs from './NavigationTabs';

export default class ContentPage extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object.isRequired,
		children: PropTypes.any,
	};

	render() {
		const { children, contentPackage, ...otherProps } = this.props;

		return (
			<>
				<NavigationTabs contentPackage={contentPackage} />
				<Page
					{...otherProps}
					contentPackage={contentPackage}
					useCommonTabs
				>
					{React.Children.map(children, x => React.cloneElement(x))}
				</Page>
			</>
		);
	}
}
