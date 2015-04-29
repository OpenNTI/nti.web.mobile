import parseDomObject from './object';

const SIZE_MAP = {
	oversize: -2,
	actual: -1,
	full: 0,
	half: 1,
	quarter: 2
};

const addPrefix = (list, prefix) => list.map(x => prefix + x);

const srcPropertyDescription = {
	enumerable: true,
	get () { return this.source.sizes[this.source.size]; }
};


export default function getImagesFromDom (contentElement) {
	let imageObjects = [];

	for(let i of contentElement.querySelectorAll('span > img')) {
		i = parseDomObject(i);

		//The properties we want to consume are:
		// crossorigin
		// id
		// src
		// dataset:
		//  ntiImageFull
		//  ntiImageHalf
		//  ntiImageQuarter
		//  ntiImageSize: "full"

		let {src, dataset = {}} = i;

		let size = SIZE_MAP[dataset.ntiImageSize];//the currently represented size by the 'src' property
		let sizes = [
			dataset.ntiImageFull,	// largest
			dataset.ntiImageHalf,	// 50% of largest
			dataset.ntiImageQuarter // 25% of largest
		];

		//lets try to be less confusing...remove the raw props.
		delete i.src;
		delete dataset.ntiImageFull;
		delete dataset.ntiImageHalf;
		delete dataset.ntiImageQuarter;
		delete dataset.ntiImageSize;
		if (Object.keys(dataset).length === 0) {
			delete i.dataset;
		}

		//the image selected is smaller than the original and should allow showing the larger one
		let zoomable = size > 0;

		// get the current source so we can figure out the prefix. (our content renderer auto-prefixes
		// all "src" and "href" attributes in our content)
		// if the size is "actual" or "oversized" the src value will be the value of the "full" src.
		let current = sizes[size] || sizes[0];

		// Attempt to discover the prefix...
		let prefix = src.replace(current, '');

		//Validate the prefix...
		if (!/\/$/.test(prefix) || src !== (prefix + current)) {
			console.warn('The content prefix does not meet expectations.', prefix, current, src);
		}

		//Apply the prefix to size sources (so they can just be used a la: new Image().src = source)
		sizes = addPrefix(sizes, prefix);


		//Format our data into a formalized structure.

		//(create a dynamic src prop so we do not duplicate strings in memory)
		Object.defineProperty(i, 'src', srcPropertyDescription);

		//Define Zoomable, and the source structure.
		Object.assign(i, {
			zoomable,
			source: { prefix, sizes, size }
		});

		//Add Image definition to the list.
		imageObjects.push(i);
	}

	return imageObjects;
}
