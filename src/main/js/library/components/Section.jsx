import React from 'react';

import cx from 'classnames';

import {scoped} from 'common/locale';

import ActiveState from 'common/components/ActiveState';
import EmptyList from 'common/components/EmptyList';

import NavigationBar from 'navigation/components/Bar';

import SectionMixin from '../mixins/SectionAware';
import BasePath from 'common/mixins/BasePath';


import Collection from './Collection';


let getTitle = scoped('LIBRARY.SECTIONS');

let sectionProps = x=> {
	let title = getTitle(x.label);
	return Object.assign({children: title, title, href: `/${x.key}`}, x);
};

export default React.createClass({
	displayName: 'Section',
	mixins: [BasePath, SectionMixin],

	propTypes: {
		section: React.PropTypes.string
	},

	componentWillMount () {
		let availableSections = this.getAvailableSections();
		this.setState({availableSections});
	},

	render () {
		let {section} = this.props;
		let bins = section ? this.getBinnedData(section) : [];
		let showCatalog = /courses/i.test(section);

		let props = {
			className: cx('library-view', { 'single-section': bins.length === 1 })
		};

		let {availableSections} = this.state;


		if (!availableSections || !availableSections.length) {
			availableSections = null;
		}

		return (
			<div>
				<NavigationBar title="Library">
					{showCatalog && ( <a href={this.getBasePath() + 'catalog/'} position="left" className="add">Add</a> )}
					{availableSections &&
						React.createElement('ul', {className: 'title-tabs', position: 'center'},
							...availableSections.map(x=>
								<li><ActiveState tag="a" {...sectionProps(x)}/></li>
							))}
				</NavigationBar>
				{ bins && bins.length > 0
					? React.createElement('div', props, ...bins.map(b=>
						<Collection title={b.name} subtitle={b.label} list={b.items}/>))
					: (
						<EmptyList type={'library-' + section}/>
					)
				}
			</div>
		);
	}

});
