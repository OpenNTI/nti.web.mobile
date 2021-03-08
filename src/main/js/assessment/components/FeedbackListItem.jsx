import React from 'react';
import PropTypes from 'prop-types';

import { DateTime, Loading } from '@nti/web-commons';
import { getAppUsername } from '@nti/web-client';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';
import { Panel } from 'internal/modeled-content';

import Editor from './FeedbackEditor';

export default class FeedbackListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onDelete: PropTypes.func.isRequired,
		onEdit: PropTypes.func.isRequired,
	};

	static defaultProps = {
		onDelete: () => {},
		onEdit: () => {},
	};

	state = {
		editing: false,
	};

	render() {
		let { item } = this.props;
		let { editing } = this.state;
		let createdBy = item.creator;
		let createdOn = item.getCreatedTime();
		let modifiedOn = item.getLastModified();
		let { body } = item;

		let edited = Math.abs(modifiedOn - createdOn) > 0;
		let canEdit = item.isModifiable && item.creator === getAppUsername();

		if (this.state.deleting) {
			return (
				<div className="feedback item">
					<Loading.Whacky />
				</div>
			);
		}

		return (
			<div className="feedback item attributed-content-item">
				<Avatar entity={createdBy} className="avatar" />
				<div className="wrap">
					<div className="meta">
						<DisplayName entity={createdBy} className="name" />
						<DateTime date={createdOn} relative />
					</div>
					{editing ? (
						<Editor
							value={item.body}
							onSubmit={this.onEdit}
							onCancel={this.onToggleEditor}
						/>
					) : (
						<div className="message">
							<Panel body={body} />
							{edited && (
								<DateTime
									date={modifiedOn}
									format={DateTime.MONTH_NAME_DAY_YEAR_TIME}
									prefix="Modified: "
								/>
							)}
						</div>
					)}

					{canEdit && !editing && (
						<div className="footer">
							<a
								href="#"
								className="link edit"
								onClick={this.onToggleEditor}
							>
								Edit
							</a>
							<a
								href="#"
								className="link delete"
								onClick={this.onDelete}
							>
								Delete
							</a>
						</div>
					)}
				</div>
			</div>
		);
	}

	onEdit = value => {
		return this.props
			.onEdit(this.props.item, value)
			.then(() => this.setState({ editing: false }));
	};

	onToggleEditor = e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({ editing: !this.state.editing });
	};

	onDelete = e => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ deleting: true });
		this.props.onDelete(this.props.item);
	};
}
