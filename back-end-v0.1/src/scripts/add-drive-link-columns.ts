import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true',
});

async function addDriveLinkColumns() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    const queries = [
      `ALTER TABLE "Propostas" ADD COLUMN IF NOT EXISTS "driveLink" VARCHAR(500);`,
      `ALTER TABLE "Contratos" ADD COLUMN IF NOT EXISTS "driveLink" VARCHAR(500);`,
      `ALTER TABLE "Documentos" ADD COLUMN IF NOT EXISTS "driveLink" VARCHAR(500);`,
    ];

    for (const query of queries) {
      await AppDataSource.query(query);
      console.log(`Query executada: ${query}`);
    }

    console.log('Colunas driveLink adicionadas com sucesso!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro ao adicionar colunas:', error);
    process.exit(1);
  }
}

addDriveLinkColumns();

