import { PrismaClient, products, users } from "@prisma/client";
import config from "config";
import bcrypt from "bcryptjs";

const dbKey = "databaseUrl";

const prisma = new PrismaClient({
  datasources: { db: { url: config.get<string>(dbKey) } },
});

const createCustomersData = async (numOfCustomers: number) => {
  const keys = [...Array(numOfCustomers).keys()];

  return await Promise.all(
    keys.map(async (v) => {
      const customer: Omit<users, "id"> = await {
        name: `John Doe ${v + 1}`,
        email: `johndoe${v + 1}@gmail.com`,
        contact_number: `81111111${v + 1}`,
        role: "CUSTOMER",
        contact_number_extension: "+62",
        password: await bcrypt.hash(`johndoe${v + 1}`, 12),
        email_verified: true,
        deleted: false,
        email_verification_code: null,
      };

      return customer;
    })
  );
};

const createProductsData = async (numOfProducts: number) => {
  const keys = [...Array(numOfProducts).keys()];

  return keys.map((v) => {
    const products: Omit<products, "id" | "created_at"> = {
      name: `Product ${v + 1}`,
      price: 10000 + v + 1,
      currency: "IDR",
      deleted: false,
    };

    return products;
  });
};

async function main() {
  console.log("Start seeding database...");

  console.log("Deleting any lingering data...");
  await prisma.users.deleteMany();
  await prisma.products.deleteMany();

  console.log("Seeding users...");
  const customers = await createCustomersData(5);

  await prisma.users.createMany({
    data: [
      {
        name: "Adnan",
        email: "madnanrizqullah@gmail.com",
        contact_number: "85156562419",
        role: "ADMIN",
        contact_number_extension: "+62",
        password: await bcrypt.hash("rahasia", 12),
        email_verified: true,
      },
      {
        name: "Vascomm",
        email: "vascomm@gmail.com",
        contact_number: "87654321",
        role: "ADMIN",
        contact_number_extension: "+62",
        password: await bcrypt.hash("rahasia", 12),
        email_verified: true,
      },
      ...customers,
    ],
  });

  console.log("Seeding products...");
  const products = await createProductsData(30);
  await prisma.products.createMany({
    data: products,
  });

  console.log(
    `Success! Seeded ${customers.length + 1} users and ${
      products.length
    } products`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
