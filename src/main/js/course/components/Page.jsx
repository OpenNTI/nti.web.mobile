import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';

import {scoped} from 'common/locale';

import Page from 'common/components/Page';

import Sections from '../Sections';

let getLabel = scoped('COURSE.SECTIONS');


export default React.createClass({
	displayName: 'course:Page',

	componentDidMount () {
		let menu = [];
		let {sectionPathPrefix} = this.props;

		if (!sectionPathPrefix) {
			sectionPathPrefix = '';
		}

		for(let s of Object.keys(Sections)) {
			let label = getLabel(s.toLowerCase());
			menu.push({label, href: sectionPathPrefix+Sections[s]});
		}

		this.setState({menu});
	},


	render () {
		let {menu} = this.state || {};
		let {children} = this.props;

		// if (course) {}

		let props = Object.assign({}, this.props, {
			availableSections: menu
		});

		return React.createElement(Page, props, ...this.renderChildren(children));
	},


	renderChildren (c) {
		if (!c) {return [];}

		if (!Array.isArray(c)) {
			c = [c];
		}

		return c.map(x=>cloneWithProps(x));
	}
});
