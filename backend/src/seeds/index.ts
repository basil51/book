// src/seeds/index.ts
import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source'; // adjust path if needed
import { seed } from './seed_file';

AppDataSource.initialize()
  .then(async (dataSource: DataSource) => {
    console.log('🔄 Dropping database...');
    await dataSource.dropDatabase();

    console.log('🏗️  Synchronizing database schema...');
    await dataSource.synchronize(); // recreate tables with new schema

    console.log('🚀 Database connected. Starting seed...');
    await seed(dataSource);

    console.log('🌱 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((err: Error) => {
    console.error('❌ Error during data source initialization:', err);
    console.error('Full error details:', err.message);
    process.exit(1);
  });
