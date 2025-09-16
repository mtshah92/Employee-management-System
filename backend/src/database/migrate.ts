import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './connection';
import { users } from './schema';
import { hashPassword } from '../utils/auth';
import { eq } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    
    // Seed default admin user
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@company.com')).limit(1);
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await hashPassword('admin123');
      await db.insert(users).values({
        email: 'admin@company.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      console.log('Default admin user created');
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();