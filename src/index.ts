import { createBot } from './bot';
import { prisma } from './db/prisma';
import { seedLocalFoods } from './services/foodSeedService';

async function bootstrap() {
    await seedLocalFoods();

    const bot = createBot();

    await bot.launch();
    console.log('Bot started');

    process.once('SIGINT', async () => {
        await prisma.$disconnect();
        bot.stop('SIGINT');
    });

    process.once('SIGTERM', async () => {
        await prisma.$disconnect();
        bot.stop('SIGTERM');
    });
}

bootstrap().catch((error) => {
    console.error('Failed to start app:', error);
    process.exit(1);
});