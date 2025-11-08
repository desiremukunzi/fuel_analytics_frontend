// Add this to your MLSegments.js component
// This creates a modal that shows customer details when clicking the count

import React, { useState } from 'react';

// Add this component for the customer modal
const CustomerListModal = ({ isOpen, onClose, segmentName, customers, loading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px' }}>
            {segmentName} - Customers
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading customers...</div>
          </div>
        )}

        {/* Customer table */}
        {!loading && customers && customers.length > 0 && (
          <>
            <div style={{ marginBottom: '16px', color: '#6b7280' }}>
              Total: {customers.length} customers
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                      Customer ID
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                      Phone Number
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={customer.motorcyclist_id} style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                    }}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                        {customer.motorcyclist_id}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                        {customer.motari_phone}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && (!customers || customers.length === 0) && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No customers found in this segment
          </div>
        )}

        {/* Close button */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Update your MLSegments component to include this functionality
// Add these to your component state:
const [modalOpen, setModalOpen] = useState(false);
const [selectedSegment, setSelectedSegment] = useState(null);
const [segmentCustomers, setSegmentCustomers] = useState([]);
const [loadingCustomers, setLoadingCustomers] = useState(false);

// Add this function to fetch customers
const fetchSegmentCustomers = async (segmentName) => {
  setLoadingCustomers(true);
  setSelectedSegment(segmentName);
  setModalOpen(true);
  
  try {
    const response = await fetch(
      `${API_URL}/api/ml/segment-customers/${encodeURIComponent(segmentName)}`
    );
    const data = await response.json();
    
    if (data.success) {
      setSegmentCustomers(data.customers);
    } else {
      console.error('Failed to fetch customers');
      setSegmentCustomers([]);
    }
  } catch (error) {
    console.error('Error fetching segment customers:', error);
    setSegmentCustomers([]);
  } finally {
    setLoadingCustomers(false);
  }
};

// In your segment card rendering, make the customer count clickable:
// Replace the customer_count display with:
<div>
  <span style={{ fontSize: '14px', color: '#6b7280' }}>Customers: </span>
  <button
    onClick={() => fetchSegmentCustomers(segment.segment_name)}
    style={{
      background: 'none',
      border: 'none',
      color: '#3b82f6',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '24px',
      fontWeight: 'bold',
      padding: 0
    }}
  >
    {segment.customer_count}
  </button>
</div>

// Add the modal at the end of your component return:
<CustomerListModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  segmentName={selectedSegment}
  customers={segmentCustomers}
  loading={loadingCustomers}
/>

export { CustomerListModal };
