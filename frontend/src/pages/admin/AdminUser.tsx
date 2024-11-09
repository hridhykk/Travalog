
import User from "../../components/admin/AdminUser"
import Sidebar from "../../components/admin/common/Sidebar";

function AdminUser() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <User/>
      </div>
    </div>
  );
}

export default AdminUser;