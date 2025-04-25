"use client";
import React, { useState, useEffect } from "react";

export default function MainComponent() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [tables, setTables] = useState([1]);
  const [tableOrders, setTableOrders] = useState<{[key: number]: any[]}>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    sectionType: "",
    itemName: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (!tables || tables.length === 0) {
      setTables([1]);
    }
  }, [tables]);

  const drinkOptions = ["Beer", "Brandy", "Rum", "Jin", "Vodka", "Gin", "Wine"];
  const beverageOptions = ["Soda", "Water", "Juice"];

  const calculateTotal = (orders: any[]) => {
    return orders?.reduce((sum, order) => sum + order.total, 0) || 0;
  };

  const handleAddOrder = () => {
    if (!selectedTable || !newOrder.sectionType || !newOrder.itemName || !newOrder.quantity || !newOrder.price) {
      alert("Please fill all required fields");
      return;
    }

    setTableOrders((prev) => ({
      ...prev,
      [selectedTable]: [
        ...(prev[selectedTable] || []),
        { 
          id: Date.now(), 
          ...newOrder, 
          quantity: Number(newOrder.quantity),
          price: Number(newOrder.price),
          total: Number(newOrder.quantity) * Number(newOrder.price) 
        },
      ],
    }));

    setNewOrder({ sectionType: "", itemName: "", quantity: "", price: "" });
  };

  // Add new state for sales history
  const [salesHistory, setSalesHistory] = useState<{
    date: string;
    sales: {
      Drinks: number;
      Beverages: number;
      Food: number;
      Other: number;
    }
  }[]>([]);

  // Add state for showing sales history
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);

  // Add handleDeleteHistory function
  const handleDeleteHistory = (date: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the sales record for ${date}?`);
    if (confirmDelete) {
      setSalesHistory(prev => prev.filter(record => record.date !== date));
    }
  };

  // Modify handlePayment function with better confirmation message
  const handlePayment = () => {
    const currentOrders = tableOrders[selectedTable];
    const total = calculateTotal(currentOrders);
    const itemCount = currentOrders.length;
    
    const confirmPayment = window.confirm(
      `Payment Confirmation - Table ${selectedTable}\n\n` +
      `Order Summary:\n` +
      `• Number of Items: ${itemCount}\n` +
      `• Total Amount Due: ₹${total}\n\n` +
      `Would you like to complete this payment transaction?`
    );
    
    if (confirmPayment) {
      // Calculate category totals and update sales history
      const categoryTotals = currentOrders.reduce((acc, order) => {
        acc[order.sectionType] = (acc[order.sectionType] || 0) + order.total;
        return acc;
      }, { Drinks: 0, Beverages: 0, Food: 0, Other: 0 });

      // Add to sales history
      const today = new Date().toLocaleDateString();
      setSalesHistory(prev => {
        const existingDayIndex = prev.findIndex(record => record.date === today);
        if (existingDayIndex >= 0) {
          const updatedHistory = [...prev];
          const existingRecord = updatedHistory[existingDayIndex];
          updatedHistory[existingDayIndex] = {
            date: today,
            sales: {
              Drinks: existingRecord.sales.Drinks + categoryTotals.Drinks,
              Beverages: existingRecord.sales.Beverages + categoryTotals.Beverages,
              Food: existingRecord.sales.Food + categoryTotals.Food,
              Other: existingRecord.sales.Other + categoryTotals.Other
            }
          };
          return updatedHistory;
        }
        return [...prev, {
          date: today,
          sales: categoryTotals
        }];
      });
      
      // Clear the orders for this table
      setTableOrders((prev) => ({ ...prev, [selectedTable]: [] }));
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="p-4 max-w-full bg-gray-100 min-h-screen">
      {/* Header - Remove this duplicate header */}
      <div className="flex justify-between items-center mb-4 bg-indigo-900 p-4 rounded-lg text-white shadow-lg">
        <h1 className="text-2xl font-bold">Thudiyalur Regal Bar and Restaurant</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSalesHistory(!showSalesHistory)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md"
          >
            {showSalesHistory ? 'Hide Sales History' : 'Show Sales History'}
          </button>
          <button
            onClick={() => setTables(prev => [...prev, Math.max(...prev) + 1])}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md"
          >
            Add New Table
          </button>
        </div>
      </div>

      {/* Table Selection */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(tables || []).map((table) => (
          <div
            key={table}
            onClick={() => setSelectedTable(table)}
            className={selectedTable === table 
              ? "p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl border-2 bg-emerald-600 text-white transform scale-105 shadow-2xl ring-2 ring-emerald-400 border-emerald-400"
              : "p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl border-2 bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-400"
            }
          >
            <h3 className="text-xl font-bold mb-1 text-white">
              Table {table}
            </h3>
            {tableOrders[table]?.length > 0 && (
              <p className="text-sm text-white">
                {tableOrders[table].length} items
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Order Form */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-lg shadow-lg mb-6 border-2 border-gray-300">
        <select
          value={newOrder.sectionType}
          onChange={(e) => setNewOrder({ ...newOrder, sectionType: e.target.value, itemName: "" })}
          className="border-2 border-gray-300 p-2 rounded-lg focus:border-indigo-900 focus:ring-2 focus:ring-indigo-900/20 bg-white"
        >
          <option value="">Select Section</option>
          <option value="Drinks">Drinks</option>
          <option value="Beverages">Beverages</option>
          <option value="Food">Food</option>
          <option value="Other">Other</option>
        </select>

        {(newOrder.sectionType === "Food" || newOrder.sectionType === "Other") ? (
          <input
            type="text"
            placeholder={`Enter ${newOrder.sectionType} Item`}
            value={newOrder.itemName}
            onChange={(e) => setNewOrder({ ...newOrder, itemName: e.target.value })}
            className="border-2 border-gray-300 p-2 rounded-lg focus:border-indigo-900 focus:ring-2 focus:ring-indigo-900/20"
          />
        ) : (
          <select
            value={newOrder.itemName}
            onChange={(e) => setNewOrder({ ...newOrder, itemName: e.target.value })}
            className="border-2 border-gray-300 p-2 rounded-lg focus:border-indigo-900 focus:ring-2 focus:ring-indigo-900/20 bg-white"
          >
            <option value="">Select Item</option>
            {newOrder.sectionType === "Drinks" && drinkOptions.map(drink => (
              <option key={drink} value={drink}>{drink}</option>
            ))}
            {newOrder.sectionType === "Beverages" && beverageOptions.map(beverage => (
              <option key={beverage} value={beverage}>{beverage}</option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={newOrder.quantity}
          onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
          className="border-2 border-gray-300 p-2 rounded-lg focus:border-indigo-900 focus:ring-2 focus:ring-indigo-900/20"
          min="1"
        />

        <input
          type="number"
          placeholder="Price"
          value={newOrder.price}
          onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
          className="border-2 border-gray-300 p-2 rounded-lg focus:border-indigo-900 focus:ring-2 focus:ring-indigo-900/20"
          min="0"
          step="0.01"
        />

        <button
          onClick={handleAddOrder}
          className="col-span-2 bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md font-semibold"
        >
          Add Order
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Table {selectedTable} Summary</h2>
        {tableOrders[selectedTable]?.length > 0 ? (
          <>
            <div className="overflow-auto max-h-[400px] mb-4">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-900 text-white sticky top-0">
                  <tr>
                    <th className="text-left p-3 border border-white">Item</th>
                    <th className="text-center p-3 border border-white">Qty</th>
                    <th className="text-right p-3 border border-white">Price</th>
                    <th className="text-right p-3 border border-white">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {tableOrders[selectedTable].map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-3 border-2 border-gray-300">{order.itemName}</td>
                      <td className="p-3 text-center border-2 border-gray-300">{order.quantity}</td>
                      <td className="p-3 text-right border-2 border-gray-300">₹{order.price}</td>
                      <td className="p-3 text-right border-2 border-gray-300 font-semibold">₹{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t-2 border-gray-300 pt-4 mt-4">
              <div className="text-2xl font-bold text-right text-indigo-900 mb-4">
                Total Amount: ₹{calculateTotal(tableOrders[selectedTable])}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 shadow-md font-semibold"
                >
                  Process Payment
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No orders for this table</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full border-4 border-indigo-900">
            <h3 className="text-2xl font-bold mb-6 text-indigo-900 border-b-2 border-indigo-900 pb-2">
              Payment Summary - Table {selectedTable}
            </h3>
            <div className="max-h-[400px] overflow-auto mb-4">
              <table className="w-full border-collapse">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="p-3 border-2 border-gray-300 text-left">Item</th>
                    <th className="p-3 border-2 border-gray-300 text-center">Qty</th>
                    <th className="p-3 border-2 border-gray-300 text-right">Price</th>
                    <th className="p-3 border-2 border-gray-300 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tableOrders[selectedTable]?.map((order) => {
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 border-2 border-gray-300">{order.itemName}</td>
                        <td className="p-3 border-2 border-gray-300 text-center">{order.quantity}</td>
                        <td className="p-3 border-2 border-gray-300 text-right">₹{order.price}</td>
                        <td className="p-3 border-2 border-gray-300 text-right">₹{order.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-3xl font-bold text-right text-blue-900 mb-6 border-t-2 border-gray-300 pt-4">
              Total Amount: ₹{calculateTotal(tableOrders[selectedTable])}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales History Section */}
      {showSalesHistory && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Sales History</h2>
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead className="bg-indigo-900 text-white">
                <tr>
                  <th className="p-3 border-2 border-gray-300 text-left">Date</th>
                  <th className="p-3 border-2 border-gray-300 text-right">Drinks</th>
                  <th className="p-3 border-2 border-gray-300 text-right">Beverages</th>
                  <th className="p-3 border-2 border-gray-300 text-right">Food</th>
                  <th className="p-3 border-2 border-gray-300 text-right">Others</th>
                  <th className="p-3 border-2 border-gray-300 text-right">Total</th>
                  <th className="p-3 border-2 border-gray-300 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.map((record) => {
                  const dayTotal = Object.values(record.sales).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={record.date} className="hover:bg-gray-50">
                      <td className="p-3 border-2 border-gray-300">{record.date}</td>
                      <td className="p-3 border-2 border-gray-300 text-right">₹{record.sales.Drinks}</td>
                      <td className="p-3 border-2 border-gray-300 text-right">₹{record.sales.Beverages}</td>
                      <td className="p-3 border-2 border-gray-300 text-right">₹{record.sales.Food}</td>
                      <td className="p-3 border-2 border-gray-300 text-right">₹{record.sales.Other}</td>
                      <td className="p-3 border-2 border-gray-300 text-right font-bold">₹{dayTotal}</td>
                      <td className="p-3 border-2 border-gray-300 text-center">
                        <button
                          onClick={() => handleDeleteHistory(record.date)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {salesHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No sales history available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}