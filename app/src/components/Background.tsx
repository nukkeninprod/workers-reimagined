export function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Line grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(222,107,107,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(222,107,107,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Fade-to-white vignette over the grid */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, white 100%)',
        }}
      />

      {/* Flare – top right, large warm coral */}
      <div
        className="absolute -top-32 -right-32 w-[580px] h-[580px] rounded-full opacity-35"
        style={{ background: '#fadada', filter: 'blur(100px)' }}
      />

      {/* Flare – bottom right, deeper brand */}
      <div
        className="absolute -bottom-24 right-[5%] w-[420px] h-[420px] rounded-full opacity-25"
        style={{ background: '#de6b6b', filter: 'blur(120px)' }}
      />

      {/* Flare – mid left, soft pink */}
      <div
        className="absolute top-[35%] -left-24 w-[320px] h-[320px] rounded-full opacity-20"
        style={{ background: '#fadada', filter: 'blur(90px)' }}
      />

      {/* Flare – top center, very subtle */}
      <div
        className="absolute -top-16 left-[35%] w-[260px] h-[260px] rounded-full opacity-15"
        style={{ background: '#de6b6b', filter: 'blur(80px)' }}
      />

    </div>
  )
}
