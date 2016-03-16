import React from 'react';

export default function UnknownListItem ({item}) {
	return (
		<div>
			{item.MimeType}
		</div>
	);
}

UnknownListItem.propTypes = {
	item: React.PropTypes.object
};
