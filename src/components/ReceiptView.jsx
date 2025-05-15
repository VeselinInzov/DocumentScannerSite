import { useState } from "react";

export default function ReceiptView({ data }) {

  const formatDate = (dateString) => {
    if (!dateString) return "Няма данни";
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split(".").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);

      const date = new Date(year, month - 1, day, hour, minute, second);

      const datePartFormatted = date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const timePartFormatted = date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      return `${datePartFormatted} at ${timePartFormatted}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Резултат</h2>
        <p className="mt-1 text-gray-600">Данни от разпознатата бележка</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-bold text-xl text-gray-800">
            {data.store || "Неизвестен магазин"}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{formatDate(data.dateTime)}</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-1">Общо сума: {data.total}</p>
            </div>

            <div className="bg-teal-50 p-3 rounded-lg">
              <p className="text-xs text-teal-700 font-medium mb-1">
                Начин на плащане: {data.paymentMethod || "Няма данни"}
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Продукти</h4>
            {data.products && data.products.length > 0 ? (
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {data.products.map((product, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Категория: {product.category || "Няма категория"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800">{product.totalPrice}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.qty} x {product.unitPrice}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">Няма разпознати продукти</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Общо {data.products?.length || 0} продукта
            </p>
            <p className="font-bold text-lg">Общо: {data.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
