import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';

import LoadingInline from 'common/components/LoadingInline';

import {getAppUsername} from 'common/Utils';

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
		var {item} = this.props;
		var {editing} = this.state;
		var createdBy = item.Creator;
		var createdOn = item.getCreatedTime();
		var modifiedOn = item.getLastModified();
		var message = item.body.join('');

		var edited = (Math.abs(modifiedOn - createdOn) > 0);
		var canEdit = item.hasLink('edit') && item.Creator === getAppUsername();

		if (this.state.deleting) {
			return <div className="feedback item"><LoadingInline/></div>;
		}

		return (
			<div className="feedback item">
				<Avatar username={createdBy} className="avatar"/>
				<div className="wrap">
					<div className="meta">
						<DisplayName username={createdBy} className="name"/>
						<DateTime date={createdOn} relative={true}/>
					</div>
					{editing ?
						<Editor value={item.body} onSubmit={this.onEdit} onCancel={this.onToggleEditor}/>
						:
						<div className="message">
							<div dangerouslySetInnerHTML={{__html: message}}/>
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
		if (e){
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
