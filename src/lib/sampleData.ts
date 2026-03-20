import { Order, PRODUCTS, COUNTRIES, USERS } from '@/types/dashboard';

export function generateSampleOrders(): Order[] {
  const orders: Order[] = [];
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
  const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Lee'];
  const statuses: Order['status'][] = ['Pending', 'In Progress', 'Completed'];
  const cities = ['New York', 'Toronto', 'Sydney', 'Singapore', 'Hong Kong', 'Los Angeles', 'Vancouver', 'Melbourne'];

  for (let i = 0; i < 25; i++) {
    const qty = Math.floor(Math.random() * 20) + 1;
    const price = Math.floor(Math.random() * 500) + 50;
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 90));
    orders.push({
      id: crypto.randomUUID(),
      customer: {
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        email: `${firstNames[i % firstNames.length].toLowerCase()}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        address: `${Math.floor(Math.random() * 9999)} Main St`,
        city: cities[i % cities.length],
        state: 'State',
        postalCode: String(Math.floor(Math.random() * 90000 + 10000)),
        country: COUNTRIES[i % COUNTRIES.length],
      },
      product: PRODUCTS[i % PRODUCTS.length],
      quantity: qty,
      unitPrice: price,
      total: qty * price,
      status: statuses[i % 3],
      createdBy: USERS[i % USERS.length],
      createdAt: d.toISOString(),
    });
  }
  return orders;
}
