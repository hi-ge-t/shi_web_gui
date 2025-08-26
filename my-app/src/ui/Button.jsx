export default function Button({variant="primary", className="", ...props}){
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition h-14 px-4";
  const styles = {
    primary: "bg-blue-500 text-white hover:brightness-105",
    ghost:   "bg-black/20 text-slate-100 border border-white/10 hover:brightness-105",
    danger:  "bg-red-500 text-white hover:brightness-105",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}