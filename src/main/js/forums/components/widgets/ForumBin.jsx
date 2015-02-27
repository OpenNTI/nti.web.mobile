import React from 'react';
import keyFor from '../../utils/key-for-item';
import ForumBoard from './ForumBoard';


export default React.createClass({
	displayName: 'ForumBin',

	propTypes: {

		/**
		*	A bin is an object with boards. Currently the usual bins
		* 	are "Enrolled For-Credit", "Open Discussions", "Other Discussions"
		*	{
		*		Parent: {
		*			forums: [...]
		*		},
		*		Section: {
		*			forums: [...]
		*		}
		*	}
		*/
		bin: React.PropTypes.object.isRequired,

		/**
		* The localized title for this bin (e.g. "Enrolled For-Credit")
		*/
		title: React.PropTypes.string.isRequired
	},

	render () {

		let {title, bin} = this.props;

		return (
			<div className="bin">
				<h2>{title}</h2>
				<ul>
				{Object.keys(bin).map(key => {
					let board = bin[key];
					return <li key={keyFor(board)}><ForumBoard title={key} board={board} /></li>;
				})}
				</ul>
			</div>
		);
	}
});
