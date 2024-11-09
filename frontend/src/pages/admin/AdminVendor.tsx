
import Vendor from "../../components/admin/vendor"
import Sidebar from "../../components/admin/common/Sidebar";

function AdminVendor() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Vendor/>
      </div>
    </div>
  );
}

export default AdminVendor;