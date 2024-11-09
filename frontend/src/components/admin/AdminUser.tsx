import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchuserData, editUser } from '../../features/admin/adminAction';
import { showToastMessage } from '../../validation/Toast';
import { ToastContainer } from 'react-toastify';
import { RootState } from '../../redux/store';
import Swal from 'sweetalert2';

interface User {
    _id?: string;
    name: string;
    email: string;
    mobile: string;
    is_blocked: boolean;
}

const AdminHome = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.admin.userData);
    
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user data
    const loadUserData = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(fetchuserData());
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToastMessage('Failed to fetch user data', 'error');
            setIsLoading(false);
        }
    }, [dispatch]);

    // Initial data load
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Filter data when search or userData changes
    useEffect(() => {
        if (userData) {
            const filtered = userData.filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [userData, search]);

    // Handle block/unblock
    const handleBlockStatus = async (userId: string, currentBlockStatus: boolean) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to ${currentBlockStatus ? 'unblock' : 'block'} this user?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: currentBlockStatus ? '#10B981' : '#EF4444',
                cancelButtonColor: '#6B7280',
                confirmButtonText: currentBlockStatus ? 'Yes, unblock!' : 'Yes, block!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                setIsLoading(true);
                await dispatch(editUser({
                    userId,
                    is_blocked: !currentBlockStatus
                }));
                
                await loadUserData();
                showToastMessage(`User ${currentBlockStatus ? 'unblocked' : 'blocked'} successfully`, 'success');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            showToastMessage('Failed to update user status', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-grow flex-col min-h-screen p-4">
            <ToastContainer />
            
            {/* Search Section */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center w-full max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        className="px-4 py-2 flex-grow rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                        className="px-4 py-2 ml-2 rounded border hover:bg-gray-100"
                        onClick={() => setSearch('')}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            )}

            {/* User Table */}
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Mobile</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((user) => (
                            <tr key={user._id} className="bg-white hover:bg-gray-50">
                                <td className="border px-4 py-2">{user.name}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">{user.mobile}</td>
                                <td className="border px-4 py-2">
                                    {user.is_blocked ? 'Blocked' : 'Active'}
                                </td>
                                <td className="border px-4 py-2">
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleBlockStatus(user._id!, user.is_blocked)}
                                            className={`${
                                                user.is_blocked 
                                                    ? 'bg-green-500 hover:bg-green-600' 
                                                    : 'bg-red-500 hover:bg-red-600'
                                            } text-white px-4 py-1 rounded transition-colors`}
                                            disabled={isLoading}
                                        >
                                            {user.is_blocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHome;