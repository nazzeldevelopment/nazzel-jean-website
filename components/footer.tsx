const SITE_NAME_FALLBACK = process.env.NEXT_PUBLIC_SITE_NAME || 'Nazzel & Avionna'
const SITE_COPY = process.env.NEXT_PUBLIC_SITE_COPY || 'Our Love, Our Story, Our Forever.'

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 bg-gradient-to-t from-rose-950/40 to-rose-900/20 border-t border-rose-200/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <p className="text-base font-semibold text-white drop-shadow-lg">
          © {new Date().getFullYear()} {SITE_NAME_FALLBACK} — {SITE_COPY}
        </p>
        <p className="text-base font-medium text-white/90 drop-shadow-md">Made with ❤️ and destiny.</p>
      </div>
    </footer>
  )
}
