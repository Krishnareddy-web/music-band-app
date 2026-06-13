/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const events = await prisma.event.findMany();
        console.log('Events in database:', JSON.stringify(events, null, 2));

        const users = await prisma.user.findMany();
        console.log('Users in database:', users.length);
    } catch (err) {
        console.error('Error querying database:', err);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
