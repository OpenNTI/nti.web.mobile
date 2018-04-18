import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Page from 'common/components/Page';

import * as Sections from '../Sections';

const getLabel = scoped('content.sections', {
	activity: 'Activity',
	discussions: 'Discussions',
	index: 'Book',
	info: 'Info',
	videos: 'Videos'
});


export default class extends React.Component {
	static displayName = 'course:Page';

	static propTypes = {
		contentPackage: PropTypes.object.isRequired,
		children: PropTypes.any
	};

	componentWillMount () {
		this.setup();
	}

	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}

	setup = (props = this.props) => {
		let {contentPackage} = props;
		let menu = [];

		let push = x => menu.push({
			label: getLabel(x.toLowerCase()),
			href: Sections[x]
		});


		for(let s of Object.keys(Sections)) {
			push(s);
		}

		if (!contentPackage.hasDiscussions()) {
			menu = menu.filter(x=> x.href !== Sections.DISCUSSIONS);
		}

		this.setState({menu});
	};

	render () {
		let {menu} = this.state || {};
		let {children} = this.props;

		if (menu && menu.length < 2) {
			menu = null;
		}

		const props = {
			...this.props,
			availableSections: menu,
			children: React.Children.map(children, x => React.cloneElement(x))
		};

		return React.createElement(Page, props);
	}
}
