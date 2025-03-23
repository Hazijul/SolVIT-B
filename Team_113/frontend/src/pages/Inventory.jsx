import React, { useState, useEffect } from 'react';
import { Plus, Search, FileDown, Pencil, Trash2, Package2, PackageX, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './Inventory.css';

const API_BASE_URL = 'inventory/api';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    businessName: '',
    quantity: 0,
    gst : 0,
    price: 0,
    category: '',
    status: 'In Stock'
  });

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      setInventory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to fetch inventory');
      setInventory([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch stats');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_BASE_URL}/${editingItem.id}`, formData);
        toast.success('Inventory updated successfully');
      } else {
        await axios.post("http://localhost:2426/student/complaint", formData);
        toast.success('Inventory added successfully');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        productName: '',
        businessName: '',
        quantity: 0,
        gst : 0,
        price: 0,
        category: '',
        status: 'In Stock'
      });
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error('Operation failed:', error);
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        toast.success('Item deleted successfully');
        fetchInventory();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(inventory);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
      XLSX.writeFile(wb, 'inventory.xlsx');
    } catch (error) {
      console.error('Failed to export to Excel:', error);
      toast.error('Failed to export to Excel');
    }
  };

  const StatsCard = ({ title, value, type }) => (
    <div className={`stats-card ${type}`}>
      <div className="stats-header">
        <div className={`stats-icon ${type}`}>
          {type === 'total' && <Package2 size={32} />}
          {type === 'low' && <AlertTriangle size={32} />}
          {type === 'out' && <PackageX size={32} />}
        </div>
        <div className="stats-value">{value}</div>
      </div>
      <p className="stats-title">{title}</p>
    </div>
  );

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Inventory Management</h1>
        
        <div className="stats-grid">
          <StatsCard title="Total Items" value={stats.totalItems} type="total" />
          <StatsCard title="Low Stock Items" value={stats.lowStock} type="low" />
          <StatsCard title="Out of Stock" value={stats.outOfStock} type="out" />
        </div>
        
        <div className="actions-bar">
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="buttons-container">
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                    productName: '',
                    businessName: '',
                    quantity: 0,
                    gst : 0,
                    price: 0,
                    category: '',
                    status: 'In Stock'
                });
                setIsModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Add New
            </button>
            <button
              onClick={exportToExcel}
              className="btn btn-secondary"
            >
              <FileDown size={20} />
              Export
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Business Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>GST</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>
                    <span className={`status-badge ${
                      item.status === 'In Stock' ? 'in-stock' :
                      item.status === 'Low Stock' ? 'low-stock' :
                      'out-of-stock'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setFormData(item);
                          setIsModalOpen(true);
                        }}
                        className="btn-icon btn-edit"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-icon btn-delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Edit Inventory' : 'Add New Inventory'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                  setFormData({
                    productName: '',
                    businessName: '',
                    quantity: 0,
                    gst : 0,
                    price: 0,
                    category: '',
                    status: 'In Stock'
                  });
                }}
                className="modal-close"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    setFormData({
                      productName: '',
                      businessName: '',
                      quantity: 0,
                      gst : 0,
                      quantity: 0,
                      price: 0,
                      category: '',
                      status: 'In Stock'
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;