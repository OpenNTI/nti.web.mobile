import React from 'react';

export default class extends React.Component {
    static displayName = 'RemoveIcon';

    static propTypes = {
		onClick: React.PropTypes.func.isRequired,
		index: React.PropTypes.number.isRequired
	};

    onClick = () => {
		const {onClick, index} = this.props;
		onClick && (index > -1) && onClick(index);
	};

    render() {
		return (
			<b onClick={this.onClick} className="remove icon-bold-x" />
		);
	}
}
