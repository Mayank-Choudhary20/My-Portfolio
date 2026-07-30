import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const allowedExact = [
        // ── Local development ──────────────────────────────────────
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',

        // ── Production domains (set in Render environment variables) ──
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean) as string[];

      // Allow if it matches an exact URL
      if (allowedExact.includes(origin)) {
        return callback(null, true);
      }

      // Allow ALL Vercel preview deployments for your account
      // Covers: my-portfolio-admin-xyz-uw-e-services.vercel.app
      //         my-portfolio-frontend-xyz-uw-e-services.vercel.app
      const vercelPreview = /^https:\/\/.*\.vercel\.app$/;
      if (vercelPreview.test(origin)) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 4000;

  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();