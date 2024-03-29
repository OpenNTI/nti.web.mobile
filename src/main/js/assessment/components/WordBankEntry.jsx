import PropTypes from 'prop-types';
import React from 'react';

import { Draggable } from 'internal/common/dnd';

import Content from './Content';

export default class extends React.Component {
	static displayName = 'WordBankEntry';

	static contextTypes = {
		QuestionUniqueDNDToken: PropTypes.object.isRequired,
	};

	static propTypes = {
		entry: PropTypes.object.isRequired,
		className: PropTypes.string,

		locked: PropTypes.bool,
		onReset: PropTypes.func,
	};

	static defaultProps = {
		onReset: () => {},
		className: '',
	};

	onResetClicked = e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (!this.props.locked) {
			this.props.onReset(this.props.entry, this);
		}
	};

	render() {
		let { content, wid } = this.props.entry;
		let props = { ...this.props, entry: undefined };
		let { locked } = props;
		let classes = ['drag', 'source'];
		if (locked) {
			classes.push('locked');
		}

		return (
			<Draggable
				{...props}
				type={this.context.QuestionUniqueDNDToken}
				cancel=".reset"
				data-source={wid}
			>
				<div className={classes.join(' ')}>
					{!locked && (
						<a
							href="#"
							className="reset"
							title="Reset"
							onClick={this.onResetClicked}
						/>
					)}
					<Content content={content} />
				</div>
			</Draggable>
		);
	}
}
