
interface StatsCardProps {
  label: string
  value: number
  color: string
  onClick?: () => void
  isActive?: boolean
}

export default function StatsCard({ label, value, color, onClick, isActive }: StatsCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isActive 
          ? 'border-[#EAB308] bg-gradient-to-br from-yellow-50 to-white shadow-md' 
          : 'border-slate-100'
      }`}
    >
      <div className="text-[11px] md:text-sm text-slate-500 font-medium mb-1 md:mb-2">{label}</div>
      <div className={`text-2xl md:text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  )
}
