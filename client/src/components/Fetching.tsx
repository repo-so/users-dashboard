import { useEffect, useState } from "react";
import { User, IdCard, AtSign, SquarePen } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
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
      const res = await fetch(`http://localhost:5000/users/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editUser.name , email: editUser.email }),
      });
      if (!res.ok) throw new Error("Failed to update user");

      const updated: User = await res.json();
      setUsers(prev => prev.map(u => (u._id === updated._id ? updated : u)));
      setEditUser(null); //close edit mode

    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  // DELETE

  const deleteUser = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/users/${_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(prev => prev.filter(u => u._id !== _id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };



  return (
    <div className="p-4 space-y-4 flex items-center flex-col-reverse ">
        
    <div className="border p-1.5 rounded-xl w-auto max-w-[38rem]">
        <h1 className="text-lg font-semibold text-center mb-3 my-1">Users table - CRUD operations - react + express</h1>

    <table className="w-full border-collapse">
  <thead>
    <tr className="border-t border-gray-500">
      <th className="p-2 text-left font-normal font-poppins border-r border-gray-500">
        <span className="flex flex-row gap-1">
          <IdCard width={20}/>Id
        </span>
      </th>
      <th className="p-2 text-left font-normal font-poppins border-r border-gray-500">
        <span className="flex flex-row gap-1 whitespace-nowrap">
          <User width={20}/>Full name
        </span>
      </th>
      <th className="p-2 text-left font-normal font-poppins border-r border-gray-500">
        <span className="flex flex-row gap-1">
          <AtSign width={18}/>Email
        </span>
      </th>
      <th className="p-2 text-left font-normal font-poppins">
        <span className="flex flex-row gap-1">
          <SquarePen width={18}/>Actions
        </span>
      </th>
    </tr>
  </thead>
  {/* List users */}
  <tbody>
    {users.map(u => (
      <tr key={u._id} className="border-t border-gray-500">
        {editUser?._id === u._id ? (
          // Inline edit form
          <>

            <td className="py-2 px-1 border-r border-gray-500">
              <input //name input
                className="border p-1 w-full rounded-sm"
                value={editUser._id}
                readOnly
              />
            </td>
            <td className="py-2 px-1 border-r border-gray-500">
              <input //name input
                className="border p-1 w-full rounded-sm"
                value={editUser.name}
                onChange={e => setEditUser({ ...editUser, name: e.target.value })}
              />
            </td>
            <td className="py-2 px-1 border-r border-gray-500">
              <input //email input
                className="border p-1 w-full rounded-sm"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              />
            </td>
            <td className="py-2 px-1.5 ">
              <div className="flex space-x-2">
                <button
                  className="bg-green-500 text-white px-4.5 py-1 rounded"
                  onClick={updateUser}
                >Save</button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditUser(null)}
                >Cancel</button>
              </div>
            </td>
          </>
        ) : (
          // Displayed data (not in edit mode)
          <>
            <td className="p-2 border-r border-gray-500 min-w-15 max-w-31 truncate">{u._id}</td>
            <td className="p-2 border-r border-gray-500 max-w-10 truncate">{u.name}</td>
            <td className="p-2 border-r border-gray-500 max-w-40 truncate">{u.email}</td>
            <td className="p-2">
              <div className="flex space-x-2">
                <button //update button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditUser(u)}
                >Update</button>
                <button //delete button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteUser(u._id)}
                >Delete</button>
              </div>
            </td>
          </>
        )}
      </tr>
    ))}
  </tbody>
</table>
        </div>


      {/*input to add user */}
      <div className="space-x-2 border rounded-lg p-5 mb-6 ">
        <input
          className="border p-1 rounded"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-1 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}  
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
          onClick={addUser}
        >Add User
        </button>

      </div>
    </div>
  );
}
