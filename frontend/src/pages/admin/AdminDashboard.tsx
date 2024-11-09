
import Dashboard from "../../components/admin/Dashboard";
import Sidebar from "../../components/admin/common/Sidebar";

function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
}

export default AdminDashboard;