import { useEffect, useState } from "react";
import { getUsers } from "../../api/users";
import type { User } from "../../types/User";

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            <div className="grid gap-3">
                {users.map((user) => (
                    <div key={user.id} className="p-4 bg-white shadow rounded">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}