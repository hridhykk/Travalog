

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-40 h-40">
        {/* Static outer circle */}
        <div className="absolute inset-0 border-8 border-gray-200 rounded-full" />

        {/* Animated spinner */}
        <div
          className="absolute inset-0 border-8 border-transparent border-t-blue-500 rounded-full animate-spin"
          style={{ animationDuration: '3s' }}
        />

        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl font-semibold text-gray-700">LOADING...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;