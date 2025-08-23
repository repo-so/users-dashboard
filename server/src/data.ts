type User = {
  id: number;
  name: string;
  email?: string;
};

export const db: { users: User[] } = {
    users: [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'John' },
  { id: 3, name: 'Bob' }
]
};
