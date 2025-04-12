export default function LoadingEscuelas() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden h-64">
            <div className="p-5 flex flex-col h-full space-y-4">
              <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
              <div className="space-y-3 flex-grow">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                ))}
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
