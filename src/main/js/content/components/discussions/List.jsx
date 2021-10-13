import './List.scss';
import PropTypes from 'prop-types';

import { EmptyList as Empty, Loading } from '@nti/web-commons';

import Item from './Item';

DiscussionsList.propTypes = {
	items: PropTypes.array,
	children: PropTypes.any,
};

export default function DiscussionsList({ children, items }) {
	return (
		<div className="discussions">
			{children}
			<div className="list">
				{!items ? (
					<Loading.Mask />
				) : items.length ? (
					items.map(x => <Item item={x} key={x.getID()} />)
				) : (
					<Empty type="discussions" />
				)}
			</div>
		</div>
	);
}
