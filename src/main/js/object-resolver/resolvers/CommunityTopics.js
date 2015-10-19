import {CommonSymbols} from 'nti.lib.interfaces';
import {resolve} from 'common/utils/user';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {join} from 'path';

let {Service} = CommonSymbols;

const isCommunityTopic = RegExp.prototype.test.bind(/communityheadlinetopic/);
const isCommunity = RegExp.prototype.test.bind(/community$/);

export default class CommunityTopicResolver {

	static handles (o) {
		let {MimeType} = o || {};
		return isCommunityTopic(MimeType);
	}

	static resolve (o) {
		return new CommunityTopicResolver(o).getPath();
	}

	constructor (o) {
		this.object = o;
		this[Service] = o[Service];
		this.getObject = id => this[Service].getParsedObject(id);
	}

	getPath () {

		/*
			/profile/
			tag%3Anextthought.com%2C2011-10%3Asystem-NamedEntity%3ACommunity-bleach/	<-- community id
			activity/
			Course_Design/																<-- forum id
			topic/
			Bleach-Topic%3AGeneralCommunity-Course_Design.from_chrome_iOS_pano			<-- topic id
		*/

		let {object} = this;
		return this.resolveContainers(object)
			.then(containers => {
				// [Forum, Board, Community]
				let forum = containers[0];
				let community = containers[2];
				return join('profile', encodeURIComponent(community.NTIID), 'activity', forum.ID, 'topic', encodeForURI(object.NTIID));
			});

	}

	resolveContainers (o) {
		if (!o.ContainerId) {
			return isCommunity(o.MimeType) ? Promise.resolve([o]) : resolve({entity: o.creator}); // resolve call will get us the Community
		}
		return this.getObject(o.ContainerId)
			.then(x => this.resolveContainers(x).then(y => [x].concat(y)));
	}
}
