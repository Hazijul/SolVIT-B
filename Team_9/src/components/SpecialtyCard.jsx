export function SpecialtyCard({ icon: Icon, name }) {
    return (
      <div className="flex flex-col items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-yellow-500" />
        </div>
        <span className="text-gray-800 text-xl text-center">{name}</span>
      </div>
    );
}
