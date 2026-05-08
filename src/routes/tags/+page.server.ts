import { getAllTags } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { isAuthenticated } = locals;    
	
	return {
		tags: getAllTags(isAuthenticated)
	};
};