import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {Link} from 'react-router-component';
import {EmptyList} from '@nti/web-commons';

import NavigationBar from 'navigation/components/Bar';
import NotFound from 'notfound/components/View';

import SectionMixin from '../mixins/SectionAware';

import Collection from './containers/Collection';
import SectionTitle from './SectionTitle';
import AddButton from './AddButton';


export default createReactClass({
	displayName: 'Section',
	mixins: [SectionMixin],

	propTypes: {
		section: PropTypes.string.isRequired
	},

	render () {
		const {props: {section}} = this;

		if (!this.isSection(section)) {
			return (
				<NotFound/>
			);
		}

		const bins = section ? this.getBinnedData(section) : [];

		const props = {
			className: cx('library-view', { 'single-section': bins.length === 1 })
		};

		return (
			<div>
				<NavigationBar>
					<section position="left">
						<Link href="/" className="return-to">Back</Link>
					</section>
				</NavigationBar>

				<div className="library-page-title-area">
					<SectionTitle section={section}/>
					<AddButton section={section}/>
				</div>

				{bins && bins.length > 0 ? (
					<div {...props}>
						{bins.map((b, i) => (
							<Collection key={b.name + (b.label || i)} title={b.name} subtitle={b.label} list={b.items}/>
						))}
					</div>
				) : (
					<EmptyList type={`library-${section}`}/>
				)}
			</div>
		);
	}

});
