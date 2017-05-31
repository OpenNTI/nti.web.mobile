import React from 'react';

import createReactClass from 'create-react-class';

import Container from './Container';
import SectionMixin from '../../mixins/SectionAware';

export default createReactClass({
	displayName: 'Books',
	mixins: [SectionMixin],

	render () {
		let books = this.getBinnedData('books');
		let items = books.reduce((a, o) => a.concat(o.items), []);

		return (
			<Container section="books" items={items}/>
		);
	}
});
