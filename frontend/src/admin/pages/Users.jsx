import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAllUsers();
        if (res && res.success) setUsers(res.users || []);
        else setError('Failed to load users');
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openUser = async (userId) => {
    try {
      const res = await adminService.getUserById(userId);
      if (res && res.success) {
        setSelectedUser(res.user);
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch user details', err);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="users-header">
        <h2>Users Management</h2>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} onClick={() => openUser(u._id)} className="users-row">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.contact}</td>
                <td>{u.age}</td>
                <td>{u.gender}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); openUser(u._id); }} className="view-btn">View</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan={7}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedUser && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            <div className="modal-content">
              <h3>{selectedUser.name}</h3>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Contact:</strong> {selectedUser.contact}</p>
              <p><strong>Age:</strong> {selectedUser.age}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>Joined:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : ''}</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setModalOpen(false)} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
