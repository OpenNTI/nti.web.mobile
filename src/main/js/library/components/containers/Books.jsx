import React from 'react';
import createReactClass from 'create-react-class';

import SectionMixin from '../../mixins/SectionAware';

import Container from './Container';

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
