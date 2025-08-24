import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email?: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //updateUser editing state (only for updateUser)
  const [editUser, setEditUser] = useState<User | null>(null);


  // READ - fetch all users at first render(useEffect)

  useEffect(() => {
    const fetchUsers = async () => {
    
      try {
        const res = await fetch("http://localhost:5000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    fetchUsers();
  }, []);


  // CREATE

  const addUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }), //in the usestate
      });
      if (!res.ok) throw new Error("Failed to add user");

      const newUser: User = await res.json();
      setUsers(prev => [...prev, newUser]); // update state
      setName(""); // clear inputs
      setEmail("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };


  // UPDATE

  const updateUser = async () => {
    if (!editUser) return;
    try {
      const res = await fetch(`http://localhost:5000/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editUser.name , email: editUser.email }),
      });
      if (!res.ok) throw new Error("Failed to update user");

      const updated: User = await res.json();
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      setEditUser(null); //close edit mode

    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  // DELETE

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };



  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Users</h1>

      {/* List users */}
      <ul>
        {users.map(u => (
          <li key={u.id} className="flex justify-between items-center border-b py-1">

            {editUser?.id === u.id ? (
              // Inline edit form
              <div className="space-y-2">
                <input //name input
                  className="border p-1 w-full"
                  value={editUser.name}
                  onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                />
                <input //email input
                  className="border p-1 w-full"
                  value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                />
                <div className="flex space-x-2">

                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={updateUser}
                  >Save
                  </button>

                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditUser(null)}
                  >Cancel
                  </button>

                </div>
              </div>
            ) : ( //below: NOT IN EDIT MODE

                <div> {/*displayed data */}
            <span>{u.id} - {u.name} - {u.email}</span> 
            <div className="space-x-2">

              <button //update button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => setEditUser(u)}
              >Update
              </button>

              <button //delete button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => deleteUser(u.id)}
              >Delete
              </button>

            </div>
            </div>
            )}
          </li>
        ))}
      </ul>

      {/*input to add user */}
      <div className="space-x-2">
        <input
          className="border p-1"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-1"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addUser}
        >Add User
        </button>

      </div>
    </div>
  );
}
