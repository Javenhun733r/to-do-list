import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ProvidersWrapper } from '@/components/providers/ProvidersWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Task Master',
	description: 'A simple, powerful to-do list application',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<ProvidersWrapper>{children}</ProvidersWrapper>
			</body>
		</html>
	);
}
