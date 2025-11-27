import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_API_URL: '/api',
	},
	async rewrites() {
		console.log('DEBUG: SERVER_URL is', process.env.SERVER_URL);
		return [
			{
				source: '/api/:path*',
				destination: `${
					process.env.SERVER_URL || 'http://server:3001'
				}/api/:path*`,
			},
		];
	},
};

export default nextConfig;
