// src/routes/graph/+page.server.ts
import { getAllPostMetadata } from '$lib/posts';
import { buildGraphData } from '$lib/graph';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { isAuthenticated } = locals;
	const posts = getAllPostMetadata(isAuthenticated);
	const graphData = buildGraphData(posts);
	
	return {
		graphData,
		isAuthenticated
	};
};