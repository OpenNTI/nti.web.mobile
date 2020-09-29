import Logger from '@nti/util-logger';
import {getService, getAppUsername} from '@nti/web-client';
import {Survey} from '@nti/web-assessment';
import {dispatch} from '@nti/lib-dispatcher';
import {getModel} from '@nti/lib-interfaces';
import {
	PAGE_LOADED,
	PAGE_FAILED,
	getPackage,
	getPageContent,
	loadPageDescriptor as load,
	registerGenerator
} from '@nti/lib-content-processing';

const logger = Logger.get('content:actions');

const SurveyRefModel = getModel('surveyref');
const SurveyModel = getModel('nasurvey');
const PageInfoModel = getModel('pageinfo');

registerGenerator(
	[...SurveyRefModel.MimeTypes, SurveyModel.MimeTypes],
	async (service, context, object) => {
		const survey = object instanceof SurveyRefModel ?
			(context.getInquiry ? await context.getInquiry(object.target) : await service.getObject(object.target)) :
			object;

		const NTIID = survey.getID();
		const {content, AssessmentItems} = await Survey.Viewer.Utils.createPageInfo(survey, context);

		const pi = new PageInfoModel(service, context, {
			ContentPackageNTIID: 'placeholder',
			ID: NTIID,
			NTIID,
			Links: [
				{
					Class: 'Link',
					href: `/dataserver2/users/${encodeURIComponent(getAppUsername())}/Pages(${encodeURIComponent(NTIID)})/UserGeneratedData`,
					rel: 'UserGeneratedData'
				},
				{
					Class: 'Link',
					href: `/dataserver2/users/${encodeURIComponent(getAppUsername())}/Pages(${encodeURIComponent(NTIID)})/RelevantContainedUserGeneratedData`,
					rel: 'RelevantContainedUserGeneratedData'
				}
			]
		});

		pi.AssessmentItems = AssessmentItems;
		pi.getContent = () => Promise.resolve(content);

		return pi;
	}
);

/**
 *	@param {string} ntiid Content Page - NTIID
 *	@param {Package|Bundle|Instance} context - An instance of a Content/Course model
 *	@param {object} [extra] - props, or extra config to pass along
 *	@returns {void}
 */
export function loadPage (ntiid, context, extra) {
	return load(ntiid, context, extra)
		.then(packet => (
			dispatch(PAGE_LOADED, packet),
			packet
		))
		.catch(error => (
			dispatch(PAGE_FAILED, {error, ntiid}),
			Promise.reject(error)
		));
}

export function resolveNewContext (pageInfo) {
	const id = pageInfo.getPackageID();
	return getService()
		.then(service => service.getContextPathFor(id))
		.catch(x => {
			const code = x && x.statusCode;
			if (code === 501 || code === 422) {
				logger.log('Ignored condition. Either the link did not exist, or has not been adapted to be generic.');
				return;//ignore error. do not do anything. (let the caller continue.)
			}

			return Promise.reject(x);
		});
}

export {
	getPageContent,
	getPackage
};
