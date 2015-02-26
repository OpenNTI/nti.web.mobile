import React from 'react';

import Loading from 'common/components/Loading';

import Collection from './Collection';

import SectionAware from '../mixins/SectionAware';

export default React.createClass({
	displayName: 'Library:View',
	mixins: [SectionAware],

	render () {
		if(this.state.loading) {
			return (<Loading />);
		}

		var props = {
			className: 'library-view'
		};

		var bins = this.getBinnedData();

		return React.createElement('div', props, ...bins.map(b=>
			<Collection title={b.name} list={b.items}/>));
	}
});
