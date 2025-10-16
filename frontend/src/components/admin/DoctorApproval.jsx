// components/admin/DoctorApproval.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Box
} from '@mui/material';

const DoctorApproval = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const response = await fetch('/api/admin/pending-doctors');
      const data = await response.json();
      setPendingDoctors(data);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
    }
  };

  const handleApprove = async (doctorId) => {
    try {
      await fetch(`/api/admin/approve-doctor/${doctorId}`, {
        method: 'PUT'
      });
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  return (
    <Box className="p-4">
      <Card sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Pending Doctor Approvals
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pendingDoctors.map(doctor => (
            <Card key={doctor._id} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{doctor.name}</Typography>
                  <Typography color="text.secondary">
                    {doctor.specialization}
                  </Typography>
                  <Typography color="text.secondary">
                    Experience: {doctor.experience} years
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApprove(doctor._id)}
                >
                  Approve
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default DoctorApproval;