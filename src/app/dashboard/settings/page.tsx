"use client"
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("enterprise");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [enterpriseType, setEnterpriseType] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);

  const handleSandbox = () => {
    setSandboxMode(!sandboxMode);
  };

  const handleConnectPayment = (method: string) => {
    console.log(`Connecting to ${method} payment service...`);
    // Implementar lógica de conexión para cada método de pago
  };

  return (
    <div className="flex flex-col p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl mb-8">Settings</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "enterprise" 
              ? "border-b border-stone-400 text-stone-600" 
              : "text-stone-800 hover:text-stone-700"
          }`}
          onClick={() => setActiveTab("enterprise")}
        >
          Enterprise
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "paymentMethods" 
              ? "border-b border-stone-400 text-stone-600" 
              : "text-stone-800 hover:text-stone-700"
          }`}
          onClick={() => setActiveTab("paymentMethods")}
        >
          Payment Methods
        </button>
      </div>
      
      {/* Enterprise Tab */}
      {activeTab === "enterprise" && (
        <div className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-600 mb-1">
                Enterprise Name
              </label>
              <input
                type="text"
                value={enterpriseName}
                onChange={(e) => setEnterpriseName(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-md"
                placeholder="Enter enterprise name"
              />
            </div>
            
            <div>
              <label className="block text-sm text-stone-600 mb-1">
                Enterprise Type
              </label>
              <select
                value={enterpriseType}
                onChange={(e) => setEnterpriseType(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-md"
              >
                <option value="">Select type</option>
                <option value="small">Small Business</option>
                <option value="medium">Medium Business</option>
                <option value="large">Large Enterprise</option>
                <option value="nonprofit">Non-Profit</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-stone-600">
                  Sandbox Mode
                </label>
                <div 
                  onClick={handleSandbox}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${
                    sandboxMode ? "bg-stone-800" : "bg-stone-200"
                  }`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      sandboxMode ? "translate-x-6" : "translate-x-1"
                    }`} 
                  />
                </div>
              </div>
              {sandboxMode && (
                <span className="block text-xs text-stone-300 -mt-1 italic">
                  All your payments will be in test mode, so it will let you pay without payment methods, to test.
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-stone-800 text-white rounded-md hover:bg-stone-600">
              Save Enterprise Settings
            </button>
          </div>
        </div>
      )}
      
      {/* Payment Methods Tab */}
      {activeTab === "paymentMethods" && (
        <div className="space-y-6">
          
          <div className="space-y-4">
            <div className="border border-stone-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-stone-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-base">S</span>
                  </div>
                  <div>
                    <h3 className="text-stone-700">Stripe</h3>
                    <p className="text-xs text-stone-800">Credit/debit card processing</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleConnectPayment("stripe")}
                  className="px-3 py-1 bg-stone-800 text-white text-sm rounded hover:bg-stone-600"
                >
                  Connect
                </button>
              </div>
            </div>

            <div className="border border-stone-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-stone-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-base">M</span>
                  </div>
                  <div>
                    <h3 className="text-stone-700">MercadoPago</h3>
                    <p className="text-xs text-stone-800">LATAM payment processor</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleConnectPayment("mercadopago")}
                  className="px-3 py-1 bg-stone-800 text-white text-sm rounded hover:bg-stone-600"
                >
                  Connect
                </button>
              </div>
            </div>

            <div className="border border-stone-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-stone-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-base">₿</span>
                  </div>
                  <div>
                    <h3 className="text-stone-700">Bitcoin Lightning</h3>
                    <p className="text-xs text-stone-800">Cryptocurrency payments</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleConnectPayment("bitcoinLightning")}
                  className="px-3 py-1 bg-stone-800 text-white text-sm rounded hover:bg-stone-600"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-stone-800 text-white rounded-md hover:bg-stone-600">
              Save Payment Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}