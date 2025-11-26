import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const todoCount = await prisma.todo.count();

  if (todoCount > 0) {
    console.log('🌱 Database is not empty. Skipping seed.');
    return;
  }

  console.log('🌱 Starting seeding...');

  await prisma.todo.deleteMany();

  console.log('🧹 Database cleared.');

  const categories = ['General', 'Work', 'Personal', 'Shopping'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Categories seeded.');

  const today = new Date();
  const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
  const nextWeek = new Date(new Date().setDate(today.getDate() + 7));
  const yesterday = new Date(new Date().setDate(today.getDate() - 1));

  const todos = [
    {
      title: 'Review Pull Request for Drag-and-Drop feature',
      isDone: true,
      priority: 10,
      category: 'Work',
      dueDate: tomorrow,
    },
    {
      title: 'Buy groceries for the week',
      isDone: false,
      priority: 5,
      category: 'Shopping',
      dueDate: today,
    },
    {
      title: 'Call Mom',
      isDone: false,
      priority: 8,
      category: 'Personal',
      dueDate: null,
    },
    {
      title: 'Fix alignment issue in CSS Grid',
      isDone: false,
      priority: 3,
      category: 'Work',
      dueDate: null,
    },
    {
      title: 'Update dependencies to latest versions',
      isDone: true,
      priority: 4,
      category: 'Work',
      dueDate: yesterday,
    },
    {
      title: 'Prepare presentation for Q4 goals',
      isDone: false,
      priority: 9,
      category: 'Work',
      dueDate: nextWeek,
    },
    {
      title: 'Refactor TodoController validation logic',
      isDone: false,
      priority: 8,
      category: 'Work',
      dueDate: tomorrow,
    },
    {
      title: 'Gym workout: Leg day',
      isDone: false,
      priority: 7,
      category: 'Personal',
      dueDate: today,
    },
    {
      title: 'Read 20 pages of "Clean Code"',
      isDone: true,
      priority: 5,
      category: 'Personal',
      dueDate: yesterday,
    },
    {
      title: 'Book dentist appointment',
      isDone: false,
      priority: 6,
      category: 'Personal',
      dueDate: null,
    },
    {
      title: 'Order new running shoes',
      isDone: false,
      priority: 4,
      category: 'Shopping',
      dueDate: null,
    },
    {
      title: 'Buy birthday gift for Sarah',
      isDone: false,
      priority: 9,
      category: 'Shopping',
      dueDate: nextWeek,
    },
    {
      title: 'Plan weekend trip to the mountains',
      isDone: false,
      priority: 6,
      category: 'General',
      dueDate: nextWeek,
    },
    {
      title: 'Clean the garage',
      isDone: false,
      priority: 2,
      category: 'General',
      dueDate: null,
    },
    {
      title: 'Water the plants',
      isDone: true,
      priority: 1,
      category: 'General',
      dueDate: yesterday,
    },
  ];

  const baseOrder = Date.now();

  for (let i = 0; i < todos.length; i++) {
    const { category, ...todoData } = todos[i];

    await prisma.todo.create({
      data: {
        ...todoData,

        order: baseOrder - i * 1000,

        category: { connect: { name: category } },
      },
    });
  }
  console.log(`✅ Seeded ${todos.length} todos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
