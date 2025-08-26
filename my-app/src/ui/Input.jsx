export default function Input(props){
  return (
    <input
      className="h-14 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-[18px] outline-none
                 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/25
                 dark:bg-[#1b2035] dark:text-slate-100"
      {...props}
    />
  );
}