import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

import Avatar from 'common/components/Avatar';
import {DateTime, LoadingInline} from 'nti-web-commons';

import {Panel} from 'modeled-content';
import DisplayName from 'common/components/DisplayName';

import {getAppUsername} from 'nti-web-client';

import Editor from './FeedbackEditor';

export default React.createClass({
	displayName: 'FeedbackListItem',


	propTypes: {
		item: React.PropTypes.object,
		onDelete: React.PropTypes.func.isRequired,
		onEdit: React.PropTypes.func.isRequired
	},


	getInitialState () {
		return {
			editing: false
		};
	},


	getDefaultProps () {
		return {
			onDelete: emptyFunction,
			onEdit: emptyFunction
		};
	},


	render () {
		let {item} = this.props;
		let {editing} = this.state;
		let createdBy = item.creator;
		let createdOn = item.getCreatedTime();
		let modifiedOn = item.getLastModified();
		let {body} = item;

		let edited = (Math.abs(modifiedOn - createdOn) > 0);
		let canEdit = item.hasLink('edit') && item.creator === getAppUsername();

		if (this.state.deleting) {
			return <div className="feedback item"><LoadingInline/></div>;
		}

		return (
			<div className="feedback item attributed-content-item">
				<Avatar entity={createdBy} className="avatar"/>
				<div className="wrap">
					<div className="meta">
						<DisplayName entity={createdBy} className="name"/>
						<DateTime date={createdOn} relative/>
					</div>
					{editing ?
						<Editor value={item.body} onSubmit={this.onEdit} onCancel={this.onToggleEditor}/>
						:
						<div className="message">
							<Panel body={body}/>
							{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
						</div>
					}

					{canEdit && !editing &&
						<div className="footer">
							<a href="#" className="link edit" onClick={this.onToggleEditor}>Edit</a>
							<a href="#" className="link delete" onClick={this.onDelete}>Delete</a>
						</div>
					}
				</div>
			</div>
		);
	},


	onEdit (value) {
		return this.props.onEdit(this.props.item, value)
			.then(()=>this.setState({editing: false}));
	},


	onToggleEditor (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({editing: !this.state.editing});
	},


	onDelete (e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({deleting: true});
		this.props.onDelete(this.props.item);
	}
});
