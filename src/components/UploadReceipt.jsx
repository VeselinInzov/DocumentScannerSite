import { isMobile, isIOS, isAndroid } from "react-device-detect";
import { useState } from "react";
import axios from "axios";

export default function UploadReceipt({ onData, onImageUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAndroidOptions, setShowAndroidOptions] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreview = reader.result;
        setPreview(imagePreview);
        onImageUpload && onImageUpload(imagePreview);
      };
      reader.readAsDataURL(selectedFile);
    }
    // Hide android options after selection
    setShowAndroidOptions(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Моля, изберете снимка на касова бележка");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://documentscannerapi.up.railway.app/api/receipt/process", 
        formData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      onData(res.data);
    } catch (error) {
      console.error("Processing failed:", error);
      setError(
        error.response?.data?.message || 
        "Грешка при обработката на бележката. Моля, опитайте с друга снимка."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAndroidOptions = () => {
    if (isAndroid) {
      setShowAndroidOptions(!showAndroidOptions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Сканирай бележка</h2>
        <p className="mt-2 text-gray-600">Снимайте или качете снимка на касовата бележка</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-center">
          {!isMobile ? (
            // Desktop version - unchanged
            <div className="relative">
              <input
                type="file"
                id="receipt-upload-desktop"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <label 
                htmlFor="receipt-upload-desktop"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Избери снимка
                </span>
              </label>
            </div>
          ) : isIOS ? (
            // iOS version - single button
            <div className="relative">
              <input
                type="file"
                id="receipt-upload-ios"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <label 
                htmlFor="receipt-upload-ios"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
              >
                <span className="text-sm font-medium text-gray-700">
                  Избери снимка или направи нова
                </span>
              </label>
            </div>
          ) : (
            // Android version - with options
            <div className="relative">
              {!showAndroidOptions ? (
                <button
                  onClick={toggleAndroidOptions}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Избери опция
                  </span>
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="camera-upload"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <label 
                      htmlFor="camera-upload"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        Направи снимка
                      </span>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="gallery-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <label 
                      htmlFor="gallery-upload"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        Избери от галерия
                      </span>
                    </label>
                  </div>
                  
                  <button
                    onClick={toggleAndroidOptions}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
                  >
                    Затвори
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Избрана снимка:</p>
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={preview} 
                alt="Receipt preview" 
                className="w-full h-full object-contain bg-gray-50" 
              />
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center font-medium ${
              file
                ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Качи и разпознай
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}