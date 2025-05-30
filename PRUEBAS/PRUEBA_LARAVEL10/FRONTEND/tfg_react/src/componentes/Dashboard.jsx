import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => setError("No autorizado"));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : <p>{error}</p>}
    </div>
  );
}

export default Dashboard;
