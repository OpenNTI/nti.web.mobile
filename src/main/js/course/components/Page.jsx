import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {isFlag} from 'nti-web-client';

import Page from 'common/components/Page';

import * as Sections from '../Sections';

let getLabel = scoped('COURSE.SECTIONS');


export default class extends React.Component {
	static displayName = 'course:Page';

	static propTypes = {
		children: PropTypes.any,

		course: PropTypes.object.isRequired
	};

	componentWillMount () {
		let menu = [];
		let {course} = this.props;
		let {CatalogEntry} = course || {};

		let push = x => {
			let label = getLabel(x.toLowerCase());
			menu.push({label, href: Sections[x]});
		};

		if (!CatalogEntry || !CatalogEntry.Preview) {

			for(let s of Object.keys(Sections)) {
				push(s);
			}
		}
		else {
			push('INFO');
		}

		if (!course.hasDiscussions()) {
			menu = menu.filter(x=>x.href !== Sections.DISCUSSIONS);
		}

		if (!course.shouldShowAssignments()) {
			menu = menu.filter(x => x.href !== Sections.ASSIGNMENTS);
		}

		if (!isFlag('course-activity')) {
			menu = menu.filter(x => x.href !== Sections.ACTIVITY);
		}

		this.setState({menu});

	}

	render () {
		let {menu} = this.state || {};
		let {children} = this.props;

		// if (course) {}

		let props = Object.assign({}, this.props, {
			availableSections: menu,
			children: React.Children.map(children, x => React.cloneElement(x))
		});

		return React.createElement(Page, props);
	}
}
