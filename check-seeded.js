const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@ayyappa.com' }
    });
    const dev = await prisma.user.findUnique({
        where: { email: 'developer@ayyappa.com' }
    });
    console.log(`ADMIN_EMAIL=${admin?.email}, ADMIN_PASS=${admin?.password}`);
    console.log(`DEV_EMAIL=${dev?.email}, DEV_PASS=${dev?.password}`);
    await prisma.$disconnect();
}
run();
