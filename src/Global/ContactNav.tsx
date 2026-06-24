import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";




const CURRENCIES = [
  { iso: "us", code: "USD", label: "US Dollar" },
  { iso: "eu", code: "EUR", label: "Euro" },
  { iso: "gb", code: "GBP", label: "British Pound" },
  { iso: "in", code: "INR", label: "Indian Rupee" },
  { iso: "ae", code: "AED", label: "UAE Dirham" },
  { iso: "ca", code: "CAD", label: "Canadian Dollar" },
  { iso: "au", code: "AUD", label: "Australian Dollar" },
  { iso: "jp", code: "JPY", label: "Japanese Yen" },
];

const LANGUAGES = [
  {
    iso: "us", code: "en", label: "English", dir: "ltr",
    t: {
      hotline: "Hotline 24/7", loremLink: "Lorem et ut",
      orderTracking: "Order Tracking", home: "Home",
      helpCenter: "Help Center", customerService: "Customer Service",
      search: "Search",
    },
  },
  {
    iso: "fr", code: "fr", label: "Français", dir: "ltr",
    t: {
      hotline: "Hotline 24/7", loremLink: "Lorem et ut",
      orderTracking: "Suivi de commande", home: "Accueil",
      helpCenter: "Centre d'aide", customerService: "Service client",
      search: "Rechercher",
    },
  },
  {
    iso: "de", code: "de", label: "Deutsch", dir: "ltr",
    t: {
      hotline: "Hotline 24/7", loremLink: "Lorem et ut",
      orderTracking: "Bestellverfolgung", home: "Startseite",
      helpCenter: "Hilfecenter", customerService: "Kundendienst",
      search: "Suchen",
    },
  },
  {
    iso: "es", code: "es", label: "Español", dir: "ltr",
    t: {
      hotline: "Hotline 24/7", loremLink: "Lorem et ut",
      orderTracking: "Seguimiento", home: "Inicio",
      helpCenter: "Centro de ayuda", customerService: "Atención al cliente",
      search: "Buscar",
    },
  },
  {
    iso: "in", code: "hi", label: "हिन्दी", dir: "ltr",
    t: {
      hotline: "हॉटलाइन 24/7", loremLink: "Lorem et ut",
      orderTracking: "ऑर्डर ट्रैकिंग", home: "होम",
      helpCenter: "सहायता केंद्र", customerService: "ग्राहक सेवा",
      search: "खोजें",
    },
  },
  {
    iso: "sa", code: "ar", label: "العربية", dir: "rtl",
    t: {
      hotline: "خط ساخن 24/7", loremLink: "Lorem et ut",
      orderTracking: "تتبع الطلب", home: "الرئيسية",
      helpCenter: "مركز المساعدة", customerService: "خدمة العملاء",
      search: "بحث",
    },
  },
  {
    iso: "cn", code: "zh", label: "中文", dir: "ltr",
    t: {
      hotline: "热线 24/7", loremLink: "Lorem et ut",
      orderTracking: "订单追踪", home: "首页",
      helpCenter: "帮助中心", customerService: "客户服务",
      search: "搜索",
    },
  },
  {
    iso: "pt", code: "pt", label: "Português", dir: "ltr",
    t: {
      hotline: "Linha direta 24/7", loremLink: "Lorem et ut",
      orderTracking: "Rastreamento", home: "Início",
      helpCenter: "Central de ajuda", customerService: "Atendimento",
      search: "Pesquisar",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FLAG component — uses flag-icons CSS classes
// ─────────────────────────────────────────────────────────────────────────────
const Flag = ({ iso, size = 20 }: { iso: string; size?: number }) => (
  <span
    className={`fi fi-${iso}`}
    style={{
      width: size,
      height: size * 0.667,
      borderRadius: 2,
      display: "inline-block",
      backgroundSize: "cover",
      flexShrink: 0,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
    }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// PILL DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
interface DropdownOption {
  iso: string;
  code: string;
  label: string;
  [key: string]: any;
}

function PillDropdown<T extends DropdownOption>({ options, selected, onSelect, keyField, labelField }: { options: T[]; selected: T; onSelect: React.Dispatch<React.SetStateAction<T>> | ((item: T) => void); keyField: string; labelField: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          border: "1px solid #e2e8f0", borderRadius: 999,
          padding: "5px 11px", fontSize: 13, color: "#2c2c2c",
          background: "white", cursor: "pointer", whiteSpace: "nowrap",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#0f6c8d"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
      >
        <Flag iso={selected.iso} size={18} />
        <span style={{ fontWeight: 500 }}>{selected[keyField]}</span>
        <FiChevronDown
          style={{
            fontSize: 11, color: "#888",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* ── Menu ── */}
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 7px)", right: 0,
            background: "white", border: "1px solid #e2e8f0",
            borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
            minWidth: 195, zIndex: 9999, overflow: "hidden",
          }}
        >
          {options.map((opt) => {
            const active = selected[keyField] === opt[keyField];
            return (
              <button
                key={opt[keyField]}
                onClick={() => { onSelect(opt); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px", fontSize: 13, textAlign: "left",
                  background: active ? "#f0f8fb" : "transparent",
                  color: active ? "#0f6c8d" : "#2c2c2c",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer", border: "none", transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f5f9fb"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Flag iso={opt.iso} size={20} />
                <span style={{ flex: 1 }}>{opt[labelField]}</span>
                {active && <span style={{ color: "#0f6c8d", fontSize: 12 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
const ContactNav = () => {

  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
 

  // Apply dir + lang to document when language changes
  useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
  }, [language]);

  const t = language.t;

  return (
    <header className="w-full bg-[#f5f5f5]  ">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm overflow-visible">

        {/* ── Top Bar ─────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-between px-6 xl:px-8 py-4 border-b border-gray-100">

          {/* Left */}
          <div className="flex items-center gap-5">
            <div className="bg-[#eef1f6] text-[#2c2c2c] text-sm px-4 py-2 rounded-md">
              {t.hotline}
            </div>
            <p className="font-semibold text-sm text-black">(025) 3886 25 16</p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6 text-sm text-[#2c2c2c]">
            <p className="cursor-pointer hover:text-[#0f6c8d] transition-all">
              {t.loremLink}
            </p>
            <p className="cursor-pointer hover:text-[#0f6c8d] transition-all">
              {t.orderTracking}
            </p>

            {/* Currency dropdown — shows code e.g. "USD" */}
            <PillDropdown
              options={CURRENCIES}
              selected={currency}
              onSelect={setCurrency}
              keyField="code"
              labelField="label"
            />

            {/* Language dropdown — shows code e.g. "EN" */}
            <PillDropdown
              options={LANGUAGES}
              selected={language}
              onSelect={(item: typeof LANGUAGES[0]) => setLanguage(item)}
              keyField="code"
              labelField="label"
            />
          </div>
        </div>

       
      </div>
    </header>
  );
};

export default ContactNav;