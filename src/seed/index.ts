import { container } from './../server';
import { SeedDatabase } from './seed';

container
    .bind<SeedDatabase>(SeedDatabase)
    .toSelf()
const seedDatabase = container.get(SeedDatabase);

seedDatabase.initialize();
