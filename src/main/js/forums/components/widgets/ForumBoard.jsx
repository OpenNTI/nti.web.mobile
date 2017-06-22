import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import keyFor from '../../utils/key-for-item';
import ForumItem from '../list-items/ForumItem';

const t = scoped('FORUMS.groupTitles');

export default function ForumBoard ({title, board}) {

	let forums = (board || {}).forums || [];
	return (
		<div className="board">
			<h3>{t(title)}</h3>
			<ul className="forum-list">
				{forums.map(forum => {
					return <li className="forum-li" key={keyFor(forum)}><ForumItem item={forum}/></li>;
				})}
			</ul>
		</div>
	);
}

ForumBoard.propTypes = {
	board: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired
};
