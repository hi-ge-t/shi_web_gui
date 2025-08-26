export function Card({className="", ...props}){
  return <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl ${className}`} {...props} />;
}