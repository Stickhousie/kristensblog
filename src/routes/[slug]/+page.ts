import { error } from '@sveltejs/kit';
import { getPost } from '$lib/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => {
	const post = getPost(data.slug, data.isAuthenticated);
	
	if (!post) {
		throw error(404, `Post not found: ${data.slug}`);
	}
	
	return {
		component: post.component,
		metadata: post.metadata,
		isAuthenticated: data.isAuthenticated
	};
};