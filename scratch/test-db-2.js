const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = "postgresql://postgres.lkmlggmstrxlqucmqovq:ADVOKESMAPOLINELA@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    console.log("Querying pengurus table...");
    const list = await prisma.pengurus.findMany();
    console.log("Success! Total pengurus found:", list.length);
    console.log(list);
  } catch (error) {
    console.error("Database query failed:", error);
  } finally {
    await prisma.$disconnect();
    pool.end();
  }
}

test();
