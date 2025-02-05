import { resolveRoute } from '$app/paths';
import { isSigningOut } from '../GoogleLogin.svelte.ts';
import { json } from '@sveltejs/kit';
import { verifyGJWT, type VerificationResult } from '$lib/components/GAuth.js';

export async function POST({ request, cookies }) {


	const bodyObject = await request.json();
	const action = bodyObject.action;

	if (!isSigningOut.status) {
		if (action === 'login') {
			const token = bodyObject.token;

			if (!token) {
				return json({ message: 'Token is required' }, { status: 400 });
			}

			const res = (await verifyGJWT(token)) as VerificationResult;
			if (res.result === true) {
				cookies.set('authToken', token,
					{
						path: '/',
						httpOnly: true,  // Prevent access via JavaScript
						secure: true,    // Only send over HTTPS
						sameSite: 'strict', // Protect against CSRF
						maxAge: 3600 * 1000, // 1 hour
					}
				);



				return json(res.object, { status: 201 })
			} else {
				return json({ message: 'Token is invalid' }, { status: 400 });
			}
		}
		else {
			console.log("Recieved log out request");
			cookies.delete('authToken',
				{
					path: '/',
					httpOnly: true,  // Prevent access via JavaScript
					secure: true,    // Only send over HTTPS
					sameSite: 'strict', // Protect against CSRF
					maxAge: 0, // 1 hour
				}
			);
			return json({ message: "logged out." }, { status: 200 })
		}
	}
	else {

		console.log("Recieved log out request");
		cookies.delete('authToken',
			{
				path: '/',
				httpOnly: true,  // Prevent access via JavaScript
				secure: true,    // Only send over HTTPS
				sameSite: 'strict', // Protect against CSRF
				maxAge: 0, // 1 hour
			}
		);
		return json({ message: "logged out." }, { status: 200 })

		return json({ message: "logging out..." }, { status: 200 })
	}

}