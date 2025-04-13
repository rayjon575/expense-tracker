import { useState } from 'react';
// Import the CSS file - make sure it's in the same directory
import '../styles/ExpenseTracker.css';

export default function ExpenseTracker() {
  // Initial sample expenses
  const initialExpenses = [
    { id: 1, name: "Groceries", amount: 56.75, category: "Food", date: "2025-04-10" },
    { id: 2, name: "Electricity bill", amount: 120.50, category: "Utilities", date: "2025-04-05" },
    { id: 3, name: "Movie tickets", amount: 24.00, category: "Entertainment", date: "2025-04-08" },
    { id: 4, name: "Gas", amount: 45.30, category: "Transportation", date: "2025-04-12" }
  ];

  const [expenses, setExpenses] = useState(initialExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add expense function
  const addExpense = () => {
    if (!formData.name || !formData.amount || !formData.category || !formData.date) {
      alert("Please fill in all fields");
      return;
    }
    
    const newId = Math.max(...expenses.map(expense => expense.id), 0) + 1;
    
    const newExpense = {
      id: newId,
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    
    // Reset form fields
    setFormData({
      name: '',
      amount: '',
      category: '',
      date: ''
    });
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense => 
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  // Delete an expense
  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <div className="expense-container">
      <h1 className="page-title">Expense Tracker</h1>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search expenses..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Expense Form */}
      <div className="form-container">
        <h2 className="form-title">Add New Expense</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Expense Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>
        <button 
          type="button" 
          onClick={addExpense}
          className="submit-button"
        >
          Add Expense
        </button>
      </div>
      
      {/* Expenses Table */}
      <div className="table-container">
        <table className="expense-table">
          <thead>
            <tr className="table-header">
              <th 
                className="sortable" 
                onClick={() => requestSort('name')}
              >
                Expense Name {getSortDirectionIndicator('name')}
              </th>
              <th>Amount</th>
              <th 
                className="sortable" 
                onClick={() => requestSort('category')}
              >
                Category {getSortDirectionIndicator('category')}
              </th>
              <th 
                className="sortable" 
                onClick={() => requestSort('date')}
              >
                Date {getSortDirectionIndicator('date')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map(expense => (
                <tr key={expense.id} className="table-row">
                  <td className="table-cell">{expense.name}</td>
                  <td className="table-cell">Ksh {expense.amount.toFixed(2)}</td>
                  <td className="table-cell">{expense.category}</td>
                  <td className="table-cell">{expense.date}</td>
                  <td className="table-cell">
                    <button 
                      onClick={() => handleDelete(expense.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="table-cell empty-row">No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="summary-container">
        <h2 className="summary-title">Summary</h2>
        <p>Total Expenses: Ksh {sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</p>
        <p>Number of Expenses: {sortedExpenses.length}</p>
      </div>
    </div>
  );
}