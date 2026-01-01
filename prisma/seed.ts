import { prisma } from "../src/application/database";
import { generateUsers } from "./factory/user";

async function main() {
    console.log("🌱 Starting database seeding...");

    await prisma.User.deleteMany();
    console.log("🗑️  Cleared existing users");

    console.log("🔄 Generating 20 random users...");
    const randomUsersData = await generateUsers(20);
    await prisma.User.createMany({ data: randomUsersData });
    console.log("✅ Created 20 random users");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Error during seeding:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
