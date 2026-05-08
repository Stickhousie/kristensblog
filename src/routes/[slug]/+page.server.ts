import { error } from '@sveltejs/kit';
import { getPost } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { isAuthenticated } = locals;    
	const post = getPost(params.slug, isAuthenticated);
	
	if (!post) {
		throw error(404, `Post not found: ${params.slug}`);
	}
	
	return {
		slug: params.slug,
		isAuthenticated
	};
};