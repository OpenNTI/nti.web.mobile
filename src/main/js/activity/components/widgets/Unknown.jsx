import PropTypes from 'prop-types';

export default function Unknown(props) {
	let { MimeType } = props.item || {};
	return (
		<error>
			<span>
				Unknown Type:
				<br />
				{MimeType}
			</span>
		</error>
	);
}

Unknown.propTypes = {
	item: PropTypes.any.isRequired,
};
