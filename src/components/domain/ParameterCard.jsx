const ParameterCard = ({ label, value, unit }) => (
  <div className="rounded-lg border border-industrial-200 bg-industrial-50 p-4 transition-colors hover:bg-industrial-100/50">
    <p className="text-[10px] font-bold uppercase tracking-wider text-industrial-500">{label}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-black tracking-tight text-industrial-900">{value ?? '--'}</span>
      <span className="text-sm font-semibold text-industrial-500">{unit}</span>
    </div>
  </div>
)

export default ParameterCard
