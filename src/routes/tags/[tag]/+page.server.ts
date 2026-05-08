import { error } from '@sveltejs/kit';
import { getPostsByTag, tagExists } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { isAuthenticated } = locals;
	const tag = params.tag;
	
	// Check if tag exists in visible posts
	if (!tagExists(tag, isAuthenticated)) {
		throw error(404, `Tag not found: ${tag}`);
	}
	
	const posts = getPostsByTag(tag, isAuthenticated);
	
	return {
		tag,
		posts,
		count: posts.length
	};
};