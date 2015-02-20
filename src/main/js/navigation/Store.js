import {SET_ACTIVE_COURSE, SET_ACTIVE_COURSE_BEGIN} from 'course/Constants';

import StorePrototype from 'common/StorePrototype';

import {
	LOADING,
	LOADED,
	TYPE_CONTENT,
	TYPE_COURSE
} from './Constants';

const IGNORE = Symbol();

const data = Symbol('data');
const SetDataLoading = Symbol('set:data:loading');
const SetData = Symbol('set:data');
const SetContentData = Symbol('set:content:data');
const SetCourseData = Symbol('set:course:data');
const GetNavigationDataFromMessage = Symbol('get:data');

function getResponse (payload) {
	let {response} = payload.action;
	if (!response || !response.taskId) {
		console.error('Bad Loading dispatch.');
		throw new Error('Bad Dispacted Event');
	}
	return response;
}


class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			//[SET_ACTIVE_CONTENT_BEGIN]: SetDataLoading,
			//[SET_ACTIVE_CONTENT]: SetContentData,
			[SET_ACTIVE_COURSE_BEGIN]: SetDataLoading,
			[SET_ACTIVE_COURSE]: SetCourseData
		});
	}


	get isLoading () {
		return this[data] === LOADING;
	}


	get isLoaded () {
		let d = this[data];
		return d != null && d !== LOADING;
	}



	[GetNavigationDataFromMessage] (payload) {
		let response = getResponse(payload);
		let _data = response.body;
		if (!_data || response.taskId !== this._loadId) {
			console.warn('Ignoring event');
			return IGNORE;
		}

		delete this._loadId;
		return _data;
	}


	[SetDataLoading] (payload) {
		let response = getResponse(payload);

		this._loadId = response.taskId;
		this[data] = LOADING;
		this.emitChange({type: LOADING});
	}


	[SetContentData] (payload) {
		let item = this[GetNavigationDataFromMessage](payload);
		if (item !== IGNORE) {
			this[SetData]({type: TYPE_CONTENT, item});
		}
	}


	[SetCourseData] (payload) {
		let item = this[GetNavigationDataFromMessage](payload);
		if (item !== IGNORE) {
			this[SetData]({type: TYPE_COURSE, item});
		}
	}


	[SetData] (o) {
		this[data] = o;
		this.emitChange({type: LOADED});
	}


	getData () { return this[data]; }
}

export default new Store();
