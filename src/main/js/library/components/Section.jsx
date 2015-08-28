import React from 'react';

import cx from 'classnames';
import {Link} from 'react-router-component';

import NavigationBar from 'navigation/components/Bar';

import EmptyList from 'common/components/EmptyList';

import BasePath from 'common/mixins/BasePath';
import SectionMixin from '../mixins/SectionAware';


import Collection from './containers/Collection';
import SectionTitle from './SectionTitle';
import AddButton from './AddButton';


export default React.createClass({
	displayName: 'Section',
	mixins: [BasePath, SectionMixin],

	propTypes: {
		section: React.PropTypes.string.isRequired
	},

	render () {
		let {props: {section}} = this;

		let bins = section ? this.getBinnedData(section) : [];

		let props = {
			className: cx('library-view', { 'single-section': bins.length === 1 })
		};

		return (
			<div>
				<NavigationBar>
					<Link href="/" position="left" className="return-to">Back</Link>
				</NavigationBar>

				<div className="library-page-title-area">
					<SectionTitle section={section}/>
					<AddButton section={section}/>
				</div>

				{bins && bins.length > 0
					? React.createElement('div', props, ...bins.map(b=>
						<Collection title={b.name} subtitle={b.label} list={b.items}/>))
					: ( <EmptyList type={'library-' + section}/> )}
			</div>
		);
	}

});
