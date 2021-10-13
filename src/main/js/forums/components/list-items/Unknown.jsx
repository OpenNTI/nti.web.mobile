import PropTypes from 'prop-types';

export default function UnknownListItem({ item }) {
	return <div>{item.MimeType}</div>;
}

UnknownListItem.propTypes = {
	item: PropTypes.object,
};
