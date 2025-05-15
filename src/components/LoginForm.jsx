import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const response = await axios.post('https://documentscannerapi.up.railway.app/api/auth/login', {
        email: data.email,
        password: data.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      onLogin();
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setLoginError(error.response?.data?.message || "Грешка при вход. Моля, проверете вашите данни.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Вход</h2>
        <p className="mt-2 text-gray-600">Въведете вашите данни за достъп</p>
      </div>
      
      {loginError && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
          {loginError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Имейл
          </label>
          <input 
            id="email"
            {...register("email", { 
              required: "Имейлът е задължителен",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Невалиден имейл адрес"
              }
            })} 
            placeholder="вашият@имейл.com" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Парола
          </label>
          <input 
            id="password"
            {...register("password", { required: "Паролата е задължителна" })} 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Вход"}
        </button>
      </form>
    </div>
  );
}