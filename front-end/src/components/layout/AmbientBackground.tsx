export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-20 -top-20 h-[480px] w-[480px] rounded-full bg-[rgba(247,147,26,0.04)] blur-[90px] animate-drift-1" />
      <div className="absolute -bottom-16 -left-16 h-[320px] w-[320px] rounded-full bg-[rgba(61,214,140,0.025)] blur-[70px] animate-drift-2" />
    </div>
  );
}
