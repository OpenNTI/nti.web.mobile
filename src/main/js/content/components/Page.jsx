import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';

import {scoped} from 'common/locale';

import Page from 'common/components/Page';

import Sections from '../Sections';

let getLabel = scoped('CONTENT.SECTIONS');


export default React.createClass({
	displayName: 'course:Page',

	componentWillMount () {
		let menu = [];

		let push = x => menu.push({
				label: getLabel(x.toLowerCase()),
				href: Sections[x]
			});

		for(let s of Object.keys(Sections)) {
			push(s);
		}

		this.setState({menu});
	},


	render () {
		let {menu} = this.state || {};
		let {children} = this.props;

		// if (course) {}

		let props = Object.assign({}, this.props, {
			availableSections: menu,
			children: React.Children.map(children, x => cloneWithProps(x))
		});

		return React.createElement(Page, props);
	}
});
