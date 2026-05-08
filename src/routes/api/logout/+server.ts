import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const SESSION_COOKIE = 'blog_session';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete(SESSION_COOKIE, { path: '/' });
	throw redirect(303, '/');
};

// Also support GET for simple link-based logout
export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete(SESSION_COOKIE, { path: '/' });
	throw redirect(303, '/');
};