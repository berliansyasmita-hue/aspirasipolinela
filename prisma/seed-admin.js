const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set in environment variables!");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const username = "admin";
  const rawPassword = "adminadvokesma123";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  console.log("Seeding admin account...");

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!existingAdmin) {
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword
        }
      });
      console.log("Admin account seeded successfully!");
      console.log(`Username: ${username}`);
      console.log(`Password: ${rawPassword}`);
    } else {
      console.log("Admin account already exists.");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
