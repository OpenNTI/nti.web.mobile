#!/usr/bin/env babel-node --optional es7.asyncFunctions

//Sniped from facebook's relay-starter-kit


import fs from 'fs';
import path from 'path';
import { Schema } from './';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

const PATH = path.resolve(__dirname, '../../../data/');

// Save JSON of full schema introspection for Babel Relay Plugin to use
async () => {
	let result = await (graphql(Schema, introspectionQuery));
	if (result.errors) {
		console.error(
			'ERROR introspecting schema: ',
			JSON.stringify(result.errors, null, 2)
		);
	} else {
		fs.writeFileSync(
			path.join(PATH, 'schema.json'),
			JSON.stringify(result, null, 2)
		);
	}
}();

if (!fs.existsSync(PATH)) {
	console.log('Making directory: ', PATH);
	fs.mkdirSync(PATH);
}

// Save user readable type system shorthand of schema
fs.writeFileSync(
	path.join(PATH, 'schema.graphql'),
	printSchema(Schema)
);
