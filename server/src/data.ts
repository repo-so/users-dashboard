type User = {
  id: number;
  name: string;
  email?: string;
};

export const db: { users: User[] } = {
    users: [
  { id: 1, name: 'Alice', email: 'email@example.com' },
  { id: 2, name: 'John', email: 'email@example.com' },
  { id: 3, name: 'Mark', email: 'email@example.com' },
  { id: 4, name: 'Jeff', email: 'email@example.com' },
  { id: 5, name: 'Bob', email: 'email@example.com' }
]
};
