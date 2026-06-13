/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Seed Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ayyappa.com' },
        update: {
            role: 'ADMIN',
            password: 'admin123'
        },
        create: {
            id: 'admin-1',
            email: 'admin@ayyappa.com',
            name: 'Head Priest (Admin)',
            role: 'ADMIN',
            password: 'admin123',
        },
    });
    console.log('Admin user seeded:', admin.email);

    // Seed Developer User
    const developer = await prisma.user.upsert({
        where: { email: 'developer@ayyappa.com' },
        update: {
            role: 'DEVELOPER',
            password: 'dev123'
        },
        create: {
            id: 'dev-1',
            email: 'developer@ayyappa.com',
            name: 'Temple Architect (Developer)',
            role: 'DEVELOPER',
            password: 'dev123',
        },
    });
    console.log('Developer user seeded:', developer.email);

    // Seed Devotee User
    const devotee = await prisma.user.upsert({
        where: { email: 'devotee@example.com' },
        update: { role: 'USER' },
        create: {
            id: 'devotee-1',
            email: 'devotee@example.com',
            name: 'Devotee User',
            role: 'USER',
        },
    });
    console.log('Devotee user seeded:', devotee.email);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const events = [
        {
            title: 'Mandalakala Mahotsavam (Past)',
            date: yesterday,
            venue: 'Main Temple Hall',
            location: 'Sabarimala',
            imageUrl: '/assets/events/event1.png',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            totalSeats: 5000,
            availableSeats: 0,
            status: 'COMPLETED'
        },
        {
            title: 'Divine Rhythms Live (Today)',
            date: today,
            venue: 'Cultural Centre',
            location: 'Hyderabad',
            imageUrl: '/assets/events/event2.png',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            totalSeats: 2000,
            availableSeats: 800,
            status: 'LIVE'
        },
        {
            title: 'Vasantha Panchami Special (Upcoming)',
            date: tomorrow,
            venue: 'Temple Hall',
            location: 'Vijayawada',
            imageUrl: '/assets/events/event3.png',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            totalSeats: 1000,
            availableSeats: 850,
            status: 'OPEN'
        }
    ];

    for (const event of events) {
        const existing = await prisma.event.findFirst({
            where: { title: event.title }
        });

        if (existing) {
            await prisma.event.update({
                where: { id: existing.id },
                data: event
            });
        } else {
            await prisma.event.create({
                data: event
            });
        }
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
