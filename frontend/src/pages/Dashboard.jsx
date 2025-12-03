import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome, {user?.name}
      </h1>
      <p className="text-gray-700 mt-2">Your personalized dashboard</p>
    </div>
  );
};

export default Dashboard;
