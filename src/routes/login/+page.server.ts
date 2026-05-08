import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';

const SESSION_COOKIE = 'blog_session';
const SESSION_SECRET = 'authenticated';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const load: PageServerLoad = async ({ locals, url }) => {
	// If already logged in, redirect to home or intended destination
	if (locals.isAuthenticated) {
		const redirectTo = url.searchParams.get('redirect') || '/';
		throw redirect(303, redirectTo);
	}
	
	return {
		redirect: url.searchParams.get('redirect')
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const password = data.get('password');
		const redirectTo = data.get('redirect')?.toString() || '/';
		
		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Password is required' });
		}
		
		const sitePassword = env.SITE_PASSWORD;
		
		if (!sitePassword) {
			console.error('SITE_PASSWORD environment variable not set');
			return fail(500, { error: 'Server configuration error' });
		}
		
		// Timing-safe comparison to prevent timing attacks
		if (!timingSafeEqual(password, sitePassword)) {
			return fail(401, { error: 'Incorrect password' });
		}
		
		// Set session cookie
		cookies.set(SESSION_COOKIE, SESSION_SECRET, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'strict',
			maxAge: SESSION_MAX_AGE
		});
		
		throw redirect(303, redirectTo);
	}
};

// Timing-safe string comparison
function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) {
		// Still do the comparison to maintain constant time
		// but we know it will fail
		let result = 1;
		for (let i = 0; i < a.length; i++) {
			result |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
		}
		return false;
	}
	
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}