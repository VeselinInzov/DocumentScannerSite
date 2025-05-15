import { useState } from "react";
import LoginForm from "./components/LoginForm";
import UploadReceipt from "./components/UploadReceipt";
import ReceiptView from "./components/ReceiptView";
import "./index.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [receiptData, setReceiptData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setReceiptData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto max-w-md py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <header className="bg-gradient-to-r from-blue-600 to-teal-500 py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-white font-bold text-xl">Касова Бележка Скенер</h1>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-blue-100 text-sm font-medium"
                >
                  Изход
                </button>
              )}
            </div>
          </header>

          <main className="p-6">
            {!isLoggedIn ? (
              <LoginForm onLogin={() => setIsLoggedIn(true)} />
            ) : receiptData ? (
              <div>
                <ReceiptView data={receiptData} />
                <button
                  onClick={() => setReceiptData(null)}
                  className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Сканирай нова бележка
                </button>
              </div>
            ) : (
              <UploadReceipt onData={setReceiptData} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}