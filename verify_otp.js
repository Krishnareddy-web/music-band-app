const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tokens = await prisma.verificationToken.findMany();
    console.log('--- Current Verification Tokens ---');
    console.log(JSON.stringify(tokens, null, 2));
    console.log('-----------------------------------');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
