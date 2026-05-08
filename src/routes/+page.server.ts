import { getAllPostMetadata, getAllTags } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { isAuthenticated } = locals;
	
	return {
		posts: getAllPostMetadata(isAuthenticated),
		tags: getAllTags(isAuthenticated),
		isAuthenticated
	};
};