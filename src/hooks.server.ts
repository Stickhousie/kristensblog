import type { Handle } from '@sveltejs/kit';

const SESSION_COOKIE = 'blog_session';
const SESSION_SECRET = 'authenticated'; // Simple token - the real security is the httpOnly cookie

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get(SESSION_COOKIE);
	event.locals.isAuthenticated = session === SESSION_SECRET;
	
	return resolve(event);
};