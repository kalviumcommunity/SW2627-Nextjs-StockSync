const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const initialProducts = [
  { id: 'prod-1', name: 'Maggi Noodles', category: 'Food', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&q=80', stock: 60 },
  { id: 'prod-2', name: 'Milk (1L)', category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', stock: 8 },
  { id: 'prod-3', name: 'Brown Bread', category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', stock: 24 },
  { id: 'prod-4', name: 'Olive Oil', category: 'Cooking', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80', stock: 0 },
  { id: 'prod-5', name: 'Greek Yogurt', category: 'Dairy', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80', stock: 42 },
  { id: 'prod-6', name: 'Basmati Rice', category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', stock: 5 },
  { id: 'prod-7', name: 'Orange Juice', category: 'Beverages', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&q=80', stock: 31 },
  { id: 'prod-8', name: 'Cheddar Cheese', category: 'Dairy', image: 'https://images.unsplash.com/photo-1618164435735-413d3b066f9a?w=300&q=80', stock: 18 },
  { id: 'prod-9', name: 'Pasta (500g)', category: 'Food', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&q=80', stock: 55 },
  { id: 'prod-10', name: 'Tomato Sauce', category: 'Condiments', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=300&q=80', stock: 3 },
  { id: 'prod-11', name: 'Corn Flakes', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&q=80', stock: 22 },
  { id: 'prod-12', name: 'Black Tea', category: 'Beverages', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&q=80', stock: 67 },
];

async function main() {
  console.log('Seeding initial managers and products...');

  const passwordHash = await bcrypt.hash('password', 10);

  await prisma.manager.upsert({
    where: { email: 'manager.a@example.com' },
    update: { emailVerifiedAt: new Date() },
    create: { id: 'mgr-1', name: 'Manager A', email: 'manager.a@example.com', passwordHash, emailVerifiedAt: new Date() },
  });

  await prisma.manager.upsert({
    where: { email: 'manager@example.com' },
    update: { emailVerifiedAt: new Date() },
    create: { id: 'mgr-2', name: 'Manager B', email: 'manager@example.com', passwordHash, emailVerifiedAt: new Date() },
  });

  for (const prod of initialProducts) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: { name: prod.name, category: prod.category, image: prod.image, stock: prod.stock },
      create: prod,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
