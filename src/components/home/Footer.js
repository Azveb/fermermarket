import { Link } from "@/i18n/routing";

const LINKS = {
  Məhsullar: [
    { href: "/products", label: "Bütün elanlar" },
    { href: "/stores", label: "Mağazalar" },
    { href: "/products?category=heyvandarliq", label: "Heyvandarlıq" },
    { href: "/products?category=texnika", label: "Texnika" },
    { href: "/products?category=gubre", label: "Gübrə & Kimya" },
  ],
  Şirkət: [
    { href: "/blog", label: "Bloq" },
    { href: "/leaderboard", label: "Liderlər" },
    { href: "/agronom", label: "AI Aqronom" },
    { href: "/elan-yerlesdir", label: "Elan yerləşdir" },
    { href: "/register", label: "Qeydiyyat" },
  ],
  Dəstək: [
    { href: "/dashboard", label: "Hesabım" },
    { href: "/messages", label: "Mesajlar" },
    { href: "/cart", label: "Səbət" },
    { href: "/login", label: "Giriş" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-gray-100 bg-gradient-to-br from-white via-gray-50/70 to-emerald-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 grid gap-8 md:grid-cols-[1.2fr,repeat(3,minmax(0,1fr))]">
          <div>
            <Link href="/" className="mb-3 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-lg text-white shadow-lg shadow-emerald-600/20">🌾</span>
              <span className="text-lg font-extrabold tracking-tight text-gray-900">
                Fermer<span className="text-emerald-700"> Market</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-gray-600">
              Azərbaycanın kənd təsərrüfatı üçün premium rəqəmsal bazarı. Fermerlər, mağazalar və alıcıları bir platformada birləşdiririk.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { label: "Premium", tone: "bg-emerald-50 text-emerald-700" },
                { label: "AI dəstəyi", tone: "bg-sky-50 text-sky-700" },
                { label: "Mobil optimizasiya", tone: "bg-amber-50 text-amber-700" },
              ].map((chip) => (
                <span key={chip.label} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${chip.tone}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-gray-600 transition-colors hover:text-emerald-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} FermerMarket. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1.5">
            <span>🇦🇿</span>
            <span>Developed By Gsmv</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
