'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const DynamicStoreProvider = dynamic(
	() => import('@/components/providers/StoreProvider'),
	{
		ssr: false,
		loading: () => null,
	}
);

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DynamicStoreProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster />
			</ThemeProvider>
		</DynamicStoreProvider>
	);
}
