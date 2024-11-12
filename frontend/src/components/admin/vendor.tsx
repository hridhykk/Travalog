import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorData, editVendor, updateVendorStatus } from '../../features/admin/adminAction';
import { showToastMessage } from '../../validation/Toast';
import { ToastContainer } from 'react-toastify';
import { RootState } from '../../redux/store';
import Swal from 'sweetalert2';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '../../components/admin/common/Modal';

interface Vendor {
    _id?: string;
    name: string;
    email: string;
    mobile?: string;
    address: string;
    city: string;
    description: string;
    documents?: string;
    password: string;
    is_blocked?: boolean;
    is_Verified?: boolean;
}

const VendorManagement = () => {
    const dispatch = useDispatch();
    const vendorData = useSelector((state: RootState) => state.admin.vendorData);
    
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    // Fetch vendor data
    const loadVendorData = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(fetchVendorData());
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToastMessage('Failed to fetch vendor data', 'error');
            setIsLoading(false);
        }
    }, [dispatch]);

    // Initial data load
    useEffect(() => {
        loadVendorData();
    }, [loadVendorData]);

    // Filter data when search or vendorData changes
    useEffect(() => {
        if (vendorData) {
            const filtered = vendorData.filter((vendor) =>
                vendor.name.toLowerCase().includes(search.toLowerCase()) ||
                vendor.email.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [vendorData, search]);

    // Handle block/unblock
    const handleBlockStatus = async (vendorId: string, currentBlockStatus: boolean) => {
                try {
                    const result = await Swal.fire({
                        title: 'Are you sure?',
                        text: `Do you want to ${currentBlockStatus ? 'unblock' : 'block'} this vendor?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: currentBlockStatus ? '#10B981' : '#EF4444',
                        cancelButtonColor: '#6B7280',
                        confirmButtonText: currentBlockStatus ? 'Yes, unblock!' : 'Yes, block!',
                        cancelButtonText: 'Cancel'
                    });
        
                    if (result.isConfirmed) {
                        setIsLoading(true);
                        await dispatch(editVendor({
                            vendorId: vendorId,
                            is_blocked: !currentBlockStatus
                        }));
                        await loadVendorData();
                        showToastMessage(`Vendor ${currentBlockStatus ? 'unblocked' : 'blocked'} successfully`, 'success');
                    }
                } catch (error) {
                    console.error('Error updating vendor status:', error);
                    showToastMessage('Failed to update vendor status', 'error');
                } finally {
                    setIsLoading(false);
                }
            };

    // Handle Vendor Verification Status
    const handleVendorVerificationStatus = async (vendorId: string, isVerified: boolean) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to ${isVerified ? 'reject' : 'accept'} this vendor?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: isVerified ? '#EF4444' : '#10B981',
                cancelButtonColor: '#6B7280',
                confirmButtonText: isVerified ? 'Yes, reject!' : 'Yes, accept!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                setIsLoading(true);
                await dispatch(updateVendorStatus({ vendorId, is_Verified: !isVerified }));
                await loadVendorData();
                showToastMessage(
                    `Vendor ${isVerified ? 'rejected' : 'accepted'} successfully`,
                    isVerified ? 'error' : 'success'
                );
            }
        } catch (error) {
            console.error('Error updating vendor status:', error);
            showToastMessage('Failed to update vendor status', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle modal open/close
    const toggleModal = (vendor: Vendor | null) => {
        setSelectedVendor(vendor);
        setShowModal(!showModal);
    };

    return (
        <div className="flex flex-grow flex-col min-h-screen p-4">
            <ToastContainer />
            
            {/* Search Section */}
            <div className="flex justify-center mb-6">
                {/* Search input and clear button */}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            )}

            {/* Vendor Table */}
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Mobile</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                            <th className="px-4 py-2">Verified Status</th>
                            <th className="px-4 py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((vendor) => (
                            <tr key={vendor._id} className="bg-white hover:bg-gray-50">
                                <td className="border px-4 py-2">{vendor.name}</td>
                                <td className="border px-4 py-2">{vendor.email}</td>
                                <td className="border px-4 py-2">{vendor.mobile ?? 'N/A'}</td>
                                <td className="border px-4 py-2">
                                    {vendor.is_blocked ? 'Blocked' : 'Active'}
                                </td>
                                <td className="border px-4 py-2">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => handleBlockStatus(vendor._id!, vendor.is_blocked!)}
                                            className={`${
                                                vendor.is_blocked 
                                                    ? 'bg-green-500 hover:bg-green-600' 
                                                    : 'bg-red-500 hover:bg-red-600'
                                            } text-white px-4 py-1 rounded transition-colors`}
                                            disabled={isLoading}
                                        >
                                            {vendor.is_blocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleVendorVerificationStatus(vendor._id!, vendor.is_Verified!)}
                                        className={`px-4 py-1 rounded transition-colors ${
                                            vendor.is_Verified 
                                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                        disabled={isLoading}
                                    >
                                        {vendor.is_Verified ? 'Accepted' : 'Rejected'}
                                    </button>
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => toggleModal(vendor)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                                    >
                                        &#8230;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal open={showModal} onClose={() => toggleModal(null)}>
                <ModalHeader>Vendor Details</ModalHeader>
                <ModalBody>
                    {selectedVendor && (
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium">Name:</label>
                                <p>{selectedVendor.name}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Email:</label>
                                <p>{selectedVendor.email}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Mobile:</label>
                                <p>{selectedVendor.mobile ?? 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Address:</label>
                                <p>{selectedVendor.address}</p>
                            </div>
                            <div>
                                <label className="block font-medium">City:</label>
                                <p>{selectedVendor.city}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Description:</label>
                                <p>{selectedVendor.description}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Documents:</label>
                                <p>{selectedVendor.documents ?? 'N/A'}</p>
                            </div>
                         
                            <div>
                                <label className="block font-medium">Blocked:</label>
                                <p>{selectedVendor.is_blocked ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Verified:</label>
                                <p>{selectedVendor.is_Verified ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => toggleModal(null)} variant="secondary">
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default VendorManagement;





// import React, { useEffect, useState, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchVendorData, editVendor, updateVendorStatus } from '../../features/admin/adminAction';
// import { showToastMessage } from '../../validation/Toast';
// import { ToastContainer } from 'react-toastify';
// import { RootState } from '../../redux/store';
// import Swal from 'sweetalert2';

// interface Vendor {
//     _id?: string;
//     name: string;
//     email: string;
//     mobile?: string;
//     is_blocked?: boolean;
//     is_accepted?: boolean;
//     is_Verified?: boolean;
// }

// const VendorManagement = () => {
//     const dispatch = useDispatch();
//     const vendorData = useSelector((state: RootState) => state.admin.vendorData);
    
//     const [search, setSearch] = useState('');
//     const [filteredData, setFilteredData] = useState<Vendor[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     // Fetch vendor data
//     const loadVendorData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             await dispatch(fetchVendorData());
//             setIsLoading(false);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             showToastMessage('Failed to fetch vendor data', 'error');
//             setIsLoading(false);
//         }
//     }, [dispatch]);

//     // Initial data load
//     useEffect(() => {
//         loadVendorData();
//     }, [loadVendorData]);

//     // Filter data when search or vendorData changes
//     useEffect(() => {
//         if (vendorData) {
//             const filtered = vendorData.filter((vendor) =>
//                 vendor.name.toLowerCase().includes(search.toLowerCase()) ||
//                 vendor.email.toLowerCase().includes(search.toLowerCase())
//             );
//             setFilteredData(filtered);
//         }
//     }, [vendorData, search]);

//     // Handle block/unblock
//     const handleBlockStatus = async (vendorId: string, currentBlockStatus: boolean) => {
//         try {
//             const result = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: `Do you want to ${currentBlockStatus ? 'unblock' : 'block'} this vendor?`,
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: currentBlockStatus ? '#10B981' : '#EF4444',
//                 cancelButtonColor: '#6B7280',
//                 confirmButtonText: currentBlockStatus ? 'Yes, unblock!' : 'Yes, block!',
//                 cancelButtonText: 'Cancel'
//             });

//             if (result.isConfirmed) {
//                 setIsLoading(true);
//                 await dispatch(editVendor({
//                     vendorId: vendorId,
//                     is_blocked: !currentBlockStatus
//                 }));
//                 await loadVendorData();
//                 showToastMessage(`Vendor ${currentBlockStatus ? 'unblocked' : 'blocked'} successfully`, 'success');
//             }
//         } catch (error) {
//             console.error('Error updating vendor status:', error);
//             showToastMessage('Failed to update vendor status', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handle Vendor Verification Status
//     const handleVendorVerificationStatus = async (vendorId: string, isVerified: boolean) => {
//         try {
//             const result = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: `Do you want to ${isVerified ? 'reject' : 'accept'} this vendor?`,
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: isVerified ? '#EF4444' : '#10B981',
//                 cancelButtonColor: '#6B7280',
//                 confirmButtonText: isVerified ? 'Yes, reject!' : 'Yes, accept!',
//                 cancelButtonText: 'Cancel'
//             });

//             if (result.isConfirmed) {
//                 setIsLoading(true);
//                 await dispatch(updateVendorStatus({ vendorId, is_Verified: !isVerified }));
//                 await loadVendorData();
//                 showToastMessage(
//                     `Vendor ${isVerified ? 'rejected' : 'accepted'} successfully`,
//                     isVerified ? 'error' : 'success'
//                 );
//             }
//         } catch (error) {
//             console.error('Error updating vendor status:', error);
//             showToastMessage('Failed to update vendor status', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-grow flex-col min-h-screen p-4">
//             <ToastContainer />
            
//             {/* Search Section */}
//             <div className="flex justify-center mb-6">
//                 {/* Search input and clear button */}
//             </div>

//             {/* Loading Indicator */}
//             {isLoading && (
//                 <div className="text-center py-4">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//                 </div>
//             )}

//             {/* Vendor Table */}
//             <div className="overflow-x-auto mt-4">
//                 <table className="table-auto w-5/6 mx-auto">
//                     <thead>
//                         <tr className="bg-gray-800 text-white">
//                             <th className="px-4 py-2">Name</th>
//                             <th className="px-4 py-2">Email</th>
//                             <th className="px-4 py-2">Mobile</th>
//                             <th className="px-4 py-2">Status</th>
//                             <th className="px-4 py-2">Actions</th>
//                             <th className="px-4 py-2">Verified Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredData.map((vendor) => (
//                             <tr key={vendor._id} className="bg-white hover:bg-gray-50">
//                                 <td className="border px-4 py-2">{vendor.name}</td>
//                                 <td className="border px-4 py-2">{vendor.email}</td>
//                                 <td className="border px-4 py-2">{vendor.mobile}</td>
//                                 <td className="border px-4 py-2">
//                                     {vendor.is_blocked ? 'Blocked' : 'Active'}
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     <div className="flex justify-center gap-2">
//                                         <button 
//                                             onClick={() => handleBlockStatus(vendor._id!, vendor.is_blocked!)}
//                                             className={`${
//                                                 vendor.is_blocked 
//                                                     ? 'bg-green-500 hover:bg-green-600' 
//                                                     : 'bg-red-500 hover:bg-red-600'
//                                             } text-white px-4 py-1 rounded transition-colors`}
//                                             disabled={isLoading}
//                                         >
//                                             {vendor.is_blocked ? 'Unblock' : 'Block'}
//                                         </button>
//                                     </div>
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     <button
//                                         onClick={() => handleVendorVerificationStatus(vendor._id!, vendor.is_Verified!)}
//                                         className={`px-4 py-1 rounded transition-colors ${
//                                             vendor.is_Verified 
//                                                 ? 'bg-green-500 hover:bg-green-600 text-white' 
//                                                 : 'bg-red-500 hover:bg-red-600 text-white'
//                                         }`}
//                                         disabled={isLoading}
//                                     >
//                                         {vendor.is_Verified ? 'Accepted' : 'Rejected'}
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default VendorManagement;