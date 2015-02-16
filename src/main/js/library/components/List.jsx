import React from 'react';

import Collection from './Collection';

import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';

import SectionAware from '../mixins/SectionAware';

export default React.createClass({
	displayName: 'List',
	mixins: [SectionAware],

	render () {
		const {section} = this.props;

		if(!this.getLibrary()) {
			return <Loading />;
		}

		var list = this.getListForSection(section);
		var filters = this.getFiltersForSection(section);

		if (list.length === 0) {
			return (<EmptyList />);
		}

		return (
			<Collection {...this.props} list={list} filters={filters} defaultFilter='Current' />
		);
	}

});
