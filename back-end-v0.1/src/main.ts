require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log', 'debug', 'verbose'], // habilite se quiser mais logs
  });

  // 1) Prefixo global (rotas da API começam com /api)
  app.setGlobalPrefix('api');

  // 2) Pipes globais de validação (class-validator / class-transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // remove campos não declarados nos DTOs
      forbidNonWhitelisted: true,  // rejeita se enviar campos extras
      transform: true,             // transforma payloads em instâncias dos DTOs
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 3) Versionamento simples por URI: /api/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 4) CORS (ajuste origins conforme seu frontend)
  /*
  app.enableCors({
    origin: true, // ou ['http://localhost:5173', 'https://seu-front.com']
    credentials: true,
  });
  */
 app.enableCors();

  // 5) Body parsers (útil para payloads “maiores”)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // 6) Swagger
  const config = new DocumentBuilder()
    .setTitle('API Climbe')
    .setDescription('Documentação da API (MVP)')
    .setVersion('1.0.0')
    // Nomeie o esquema de auth para usar em @ApiBearerAuth('bearer')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o JWT sem o prefixo "Bearer "',
      },
      'bearer',
    )
    // Se quiser descrever cada tag:
    .addTag('auth', 'Autenticação e sessão')
    .addTag('users', 'Gestão de usuários e acessos')
    .addTag('roles', 'Cargos e perfis')
    .addTag('permissions', 'Permissões do sistema')
    .addTag('companies', 'Empresas')
    .addTag('proposals', 'Propostas')
    .addTag('contracts', 'Contratos')
    .addTag('audit', 'Auditoria')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,       // mantém o token após refresh
      displayRequestDuration: true,
    },
    customSiteTitle: 'Climbe – API Docs',
  });

  // (opcional) exporta o OpenAPI em disco para integração com front/QA
  // import { writeFileSync } from 'fs';
  // writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  // 7) Porta
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  // Logs de utilidade
  const base = `http://localhost:${port}`;
  console.log(`API     👉 ${base}/api/v1`);
  console.log(`Swagger 👉 ${base}/docs`);
  console.log(`Spec    👉 ${base}/docs-json`);
}
bootstrap();
