export default function TestButton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl mb-4">Button Test</h1>
        
        {/* Same button styling as login page */}
        <button
          type="button"
          className="w-full bg-charcoal-800 text-white py-3 rounded-lg font-medium hover:bg-charcoal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mb-4"
        >
          Sign In (Charcoal)
        </button>

        {/* Fallback with standard colors */}
        <button
          type="button"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg mb-4"
        >
          Sign In (Black)
        </button>

        {/* Another test */}
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Sign In (Blue)
        </button>
      </div>
    </div>
  );
}
