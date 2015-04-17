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
		let {sectionPathPrefix, course} = this.props;
		let {CatalogEntry} = course || {};

		if (!sectionPathPrefix) {
			sectionPathPrefix = '';
		}

		let push = x => {
			let label = getLabel(x.toLowerCase());
			menu.push({label, href: sectionPathPrefix + Sections[x]});
		};

		if (!CatalogEntry || !CatalogEntry.Preview) {

			for(let s of Object.keys(Sections)) {
				push(s);
			}
		}
		else {
			push('INFO');
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
		if (!c) { return []; }

		if (!Array.isArray(c)) {
			c = [c];
		}

		return c.map(x=>cloneWithProps(x));
	}
});
