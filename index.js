import express from 'express';
import graphQLHTTP from 'express-graphql';
import DataLoader from 'dataloader';

import schema from './schema';

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const getPersonByID = (id) => {
  return fetch(`${BASE_URL}/person/${id}`)
		.then(res => res.json())
		.then(json => json);
}

const app = express();

app.use(graphQLHTTP(req => {
	const personLoader = new DataLoader(
		keys => Promise.all(keys.map(getPersonByID))
	)
	const loaders = {
		person: personLoader
	}
	return {
		context: {loaders},
		schema,
		graphiql: true
	};
}));

app.listen(5000);