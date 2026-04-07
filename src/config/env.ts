import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
}

export const env = {
    BOT_TOKEN: requireEnv('BOT_TOKEN'),
    DATABASE_URL: requireEnv('DATABASE_URL'),
    USDA_API_KEY: process.env.USDA_API_KEY ?? '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};