import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {logout}  from '../../../features/admin/adminSlice'
const Sidebar: React.FC = () => {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', path: '/admin/home' },
    { name: 'User Management', path: '/admin/users' },
    { name: 'Vendor Management', path: '/admin/vendors' },
    { name: 'Post Management', path: '/admin/home' },
    { name: 'Booking Management', path: '/admin/home' },
  ];

  const dispatch = useDispatch()
const handlelogout=()=>{
dispatch(logout())
}
  return (
    <div className="bg-teal-700 text-white h-screen w-64 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 bg-teal-800 p-2 rounded">ADMIN</h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block p-2 rounded ${
                  location.pathname === item.path
                    ? 'bg-teal-500'
                    : 'bg-teal-600  text-white hover:bg-teal-500'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={()=>handlelogout()}>logout </button>
      </nav>
    </div>
  );
};

export default Sidebar;