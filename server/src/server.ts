import app from './app';
import dotenv from 'dotenv';
import { prismaService } from './config/prisma.service';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function bootstrap() {
	try {
		await prismaService.onModuleInit();
		console.log('✅ Connected to Database');

		app.listen(PORT, () => {
			console.log(`🚀 Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('❌ Failed to start server:', error);
		process.exit(1);
	}
}

bootstrap();
