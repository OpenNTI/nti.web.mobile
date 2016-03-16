import React from 'react';

import ForumItem from '../list-items/ForumItem';
import keyFor from '../../utils/key-for-item';
import {scoped} from 'common/locale';

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
	board: React.PropTypes.object.isRequired,
	title: React.PropTypes.string.isRequired
};
