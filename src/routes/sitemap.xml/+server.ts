import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
	let text = await (
		await sitemap.response({
			origin: 'https://fuiz.us',
			lang: {
				default: 'en',
				alternates: ['es']
			}
		})
	).text();

	let res = new Response(
		text.replace('https://www.s', 'http://www.s').replaceAll('https://www.g', 'http://www.g'),
		{
			headers: {
				'cache-control': 'max-age=0, s-maxage=3600',
				'content-type': 'text/xml'
			}
		}
	);

	return res;
};
