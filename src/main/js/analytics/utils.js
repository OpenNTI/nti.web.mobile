
export function filterContextPath (context, resourceId) {
	let first = context[0],
		last = context[context.length - 1];

	//if the end of the path is the resourceId (it should) then drop it.
	last = (last && (last.ntiid === resourceId || last === resourceId)) ? -1 : undefined;
	if (!last) {
		console.error('The last entry in the context path is not the resource.');
	}

	first = (typeof first === 'object' && !first.ntiid) ? 1 : 0;
	if (first) {
		console.warn('Context "root" has no ntiid, omitting: %o', context);
	}

	if (first || last) {
		context = context.slice(first, last);
	}

	return context;
}


export function toAnalyticsPath (context, resourceId) {
	return filterContextPath(context, resourceId)
		.map(x=> x.ntiid || (typeof x === 'string' ? x : null))
		.filter(x=>x);
}
