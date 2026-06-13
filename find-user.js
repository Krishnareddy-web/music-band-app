const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const user = await prisma.user.findUnique({
        where: { email: 'krishnareddy02072006@gmail.com' }
    });
    console.log(user ? JSON.stringify(user, null, 2) : 'User not found');
    await prisma.$disconnect();
}
run();
