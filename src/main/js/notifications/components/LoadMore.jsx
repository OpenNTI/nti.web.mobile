import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';
import { Button } from '@nti/web-core';

export default function LoadMore({ store, onClick }) {
	return (
		<div className="text-center button-box">
			{store.isBusy ? (
				<Loading.Spinner />
			) : (
				<Button onClick={onClick}>Load More</Button>
			)}
		</div>
	);
}

LoadMore.propTypes = {
	onClick: PropTypes.func,
	store: PropTypes.object,
};
