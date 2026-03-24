import React, { useEffect, useState } from "react";
import { getTasks } from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  return (
    <div>
      <h1>Dashboard</h1>

      <h3>Total Tasks: {totalTasks}</h3>
      <h3>Completed Tasks: {completedTasks}</h3>
      <h3>Pending Tasks: {pendingTasks}</h3>
    </div>
  );
}

export default Dashboard;
