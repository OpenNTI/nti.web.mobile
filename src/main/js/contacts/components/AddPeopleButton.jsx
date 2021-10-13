import PropTypes from 'prop-types';

export default function AddPeopleButton({ onClick }) {
	return (
		<div className="add-people" onClick={onClick}>
			<i className="icon-add-user" />
			<span>Add People</span>
		</div>
	);
}

AddPeopleButton.propTypes = {
	onClick: PropTypes.func.isRequired,
};
