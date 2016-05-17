import React from 'react';

import InlineLoader from 'common/components/LoadingInline';
import Button from 'forms/components/Button';

export default function LoadMore ({store, onClick}) {
	return (
		<div className="text-center button-box">
			{store.isBusy ?
				<InlineLoader/>
			:
				<Button onClick={onClick}>Load More</Button>
			}
		</div>
	);
}

LoadMore.propTypes = {
	onClick: React.PropTypes.func,
	store: React.PropTypes.object
};
