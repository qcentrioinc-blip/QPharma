import { useState } from "react";
import {
  FiArrowRight,
  FiUser,
  FiPackage,
  FiMapPin,
  FiLock,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiTruck,
} from "react-icons/fi";
import ContactNav from "../../Global/ContactNav";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabId = "account" | "orders" | "addresses" | "security";

type OrderStatus = "Delivered" | "In Transit" | "Processing" | "Cancelled";

interface NavTab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

interface Order {
  id: string;
  poNumber: string;
  date: string;
  category: "Herbal" | "Nutraceutical" | "Organic";
  units: number;
  total: number;
  status: OrderStatus;
}

interface Address {
  id: string;
  label: string;
  company: string;
  contactName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefaultBilling?: boolean;
  isDefaultShipping?: boolean;
}

interface AccountInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

// ---------------------------------------------------------------------------
// Static config / mock data
// ---------------------------------------------------------------------------

const NAV_TABS: NavTab[] = [
  { id: "account", label: "Account Info", icon: FiUser },
  { id: "orders", label: "My Orders", icon: FiPackage },
  { id: "addresses", label: "My Address", icon: FiMapPin },
  { id: "security", label: "Change Password", icon: FiLock },
];

const ACCOUNT_NUMBER = "ACCT-042519";

const INITIAL_ORDERS: Order[] = [
  {
    id: "1",
    poNumber: "PO-88213",
    date: "Jun 28, 2026",
    category: "Nutraceutical",
    units: 4800,
    total: 62400,
    status: "In Transit",
  },
  {
    id: "2",
    poNumber: "PO-88147",
    date: "Jun 12, 2026",
    category: "Herbal",
    units: 12000,
    total: 145200,
    status: "Delivered",
  },
  {
    id: "3",
    poNumber: "PO-88090",
    date: "May 30, 2026",
    category: "Organic",
    units: 2600,
    total: 31980,
    status: "Delivered",
  },
  {
    id: "4",
    poNumber: "PO-87994",
    date: "May 18, 2026",
    category: "Nutraceutical",
    units: 7200,
    total: 88560,
    status: "Processing",
  },
  {
    id: "5",
    poNumber: "PO-87811",
    date: "Apr 22, 2026",
    category: "Herbal",
    units: 1500,
    total: 18750,
    status: "Cancelled",
  },
];

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "Headquarters",
    company: "Meridian Health Group",
    contactName: "Mark Cole",
    line1: "480 Concourse Drive, Suite 900",
    city: "Austin",
    state: "TX",
    zip: "78701",
    country: "United States",
    phone: "+1 (512) 555-0148",
    isDefaultBilling: true,
  },
  {
    id: "2",
    label: "Distribution Center",
    company: "Meridian Health Group",
    contactName: "Warehouse Receiving",
    line1: "1180 Freeport Industrial Pkwy",
    line2: "Dock C",
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    country: "United States",
    phone: "+1 (512) 555-0392",
    isDefaultShipping: true,
  },
];

const EMPTY_ADDRESS: Omit<Address, "id"> = {
  label: "",
  company: "",
  contactName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  Delivered: "bg-[#EAF2E6] text-[#3F6B2C]",
  "In Transit": "bg-[#F3ECDD] text-[#8A6A2F]",
  Processing: "bg-[#EAEEF3] text-[#3E5C7A]",
  Cancelled: "bg-[#F5E9E7] text-[#A34C3E]",
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const UNITS_FORMATTER = new Intl.NumberFormat("en-US");

const FONT_DISPLAY = "font-['Fraunces',_serif]";
const FONT_MONO = "font-['IBM_Plex_Mono',_ui-monospace,_monospace]";

// ---------------------------------------------------------------------------
// Small shared bits
// ---------------------------------------------------------------------------

const SectionHeading = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-6 sm:mb-8">
    <p className={`${FONT_MONO} text-[11px] tracking-[0.14em] uppercase text-[#547A3D]`}>
      {eyebrow}
    </p>
    <h1 className={`${FONT_DISPLAY} mt-1 text-2xl sm:text-3xl font-semibold text-[#1E2A22]`}>
      {title}
    </h1>
  </div>
);

const FieldLabel = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
  <label className="block text-sm font-medium text-[#3A3F3B] mb-2">
    {children}
    {optional ? (
      <span className="text-gray-400 text-xs ml-1">(Optional)</span>
    ) : (
      <span className="text-[#A34C3E] ml-1">*</span>
    )}
  </label>
);

const inputClasses =
  "w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#547A3D] focus:border-transparent transition-shadow";

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const Sidebar = ({ activeTab, onSelectTab }: SidebarProps) => (
  <aside className="w-full lg:w-[300px] shrink-0">
    <div className="bg-[#FAF9F5] rounded-xl border border-[#E7E4DC] p-5 lg:sticky lg:top-6">
      {/* Identity */}
      <div className="flex items-center gap-4 lg:flex-col lg:items-start">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Mark Cole"
          className="w-12 h-12 lg:w-full lg:h-auto lg:aspect-square rounded-lg object-cover border border-[#E7E4DC]"
        />
        <div className="lg:mt-4 lg:w-full">
          <h2 className={`${FONT_DISPLAY} text-lg font-semibold text-[#1E2A22]`}>Mark Cole</h2>
          <p className="text-sm text-gray-500 mt-0.5">Meridian Health Group</p>
        </div>
      </div>

      {/* Account meta */}
      <div className="mt-5 pt-5 border-t border-[#E7E4DC] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Account No.</span>
          <span className={`${FONT_MONO} text-xs text-[#1E2A22]`}>{ACCOUNT_NUMBER}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Tier</span>
          <span className="inline-flex items-center rounded-full bg-[#547A3D] text-white text-[11px] font-medium px-2.5 py-0.5">
            Enterprise Partner
          </span>
        </div>
      </div>

      {/* Nav — vertical on desktop, horizontal scroll on mobile */}
      <nav className="mt-6 -mx-1 flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 lg:overflow-visible">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center justify-between gap-3 rounded-lg px-4 py-3.5 text-sm font-medium whitespace-nowrap shrink-0 lg:shrink transition-all duration-300 ${
                isActive
                  ? "bg-[#547A3D] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="shrink-0 text-base" />
                {tab.label}
              </span>
              <FiArrowRight className="hidden lg:block shrink-0 text-base transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          );
        })}
      </nav>

      {/* Account manager — the B2B touch */}
      {/* <div className="mt-6 pt-5 border-t border-[#E7E4DC]">
        <p className="text-xs text-gray-500 mb-3">Your account manager</p>
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/80?img=33"
            alt="Priya Anand"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1E2A22] truncate">Priya Anand</p>
            <p className="text-xs text-gray-500 truncate">Bulk Accounts Lead</p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          
            href="mailto:priya.anand@zephyr.com"
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#547A3D] transition-colors"
          <a>
            <FiMail className="shrink-0" /> priya.anand@zephyr.com
          </a>
          
            href="tel:+15125550117"
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#547A3D] transition-colors"
          <a>
            <FiPhone className="shrink-0" /> +1 (512) 555-0117
          </a>
        </div>
      </div> */}
    </div>
  </aside>
);

// ---------------------------------------------------------------------------
// Account Info panel
// ---------------------------------------------------------------------------

const AccountInfoPanel = () => {
  const [form, setForm] = useState<AccountInfoForm>({
    firstName: "Mark",
    lastName: "Cole",
    email: "swoo@gmail.com",
    phone: "+1 0231 4554 452",
    companyName: "Meridian Health Group",
  });
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof AccountInfoForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div>
      <SectionHeading eyebrow="Account" title="Account Info" />

      <form className="space-y-5 max-w-2xl" onSubmit={handleSubmit}>
        <div>
          <FieldLabel>Company Name</FieldLabel>
          <input
            type="text"
            value={form.companyName}
            onChange={updateField("companyName")}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>First Name</FieldLabel>
            <input
              type="text"
              value={form.firstName}
              onChange={updateField("firstName")}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel>Last Name</FieldLabel>
            <input
              type="text"
              value={form.lastName}
              onChange={updateField("lastName")}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Email Address</FieldLabel>
          <input type="email" value={form.email} onChange={updateField("email")} className={inputClasses} />
        </div>

        <div>
          <FieldLabel optional>Phone Number</FieldLabel>
          <input type="text" value={form.phone} onChange={updateField("phone")} className={inputClasses} />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-full bg-[#547A3D] px-10 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-[#456632] hover:shadow-lg"
          >
            SAVE
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-[#3F6B2C]">
              <FiCheck /> Changes saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Orders panel
// ---------------------------------------------------------------------------

const OrdersPanel = () => {
  const [orders] = useState<Order[]>(INITIAL_ORDERS);

  return (
    <div>
      <SectionHeading eyebrow={`${orders.length} Purchase Orders`} title="My Orders" />

      {/* Column header — desktop only */}
      <div className="hidden md:grid grid-cols-[1.1fr_1fr_1fr_0.9fr_0.9fr_0.8fr] gap-4 px-5 pb-3 text-xs uppercase tracking-wide text-gray-400 border-b border-[#E7E4DC]">
        <span>PO Number</span>
        <span>Date</span>
        <span>Category</span>
        <span>Units</span>
        <span>Total</span>
        <span>Status</span>
      </div>

      <ul className="divide-y divide-[#E7E4DC]">
        {orders.map((order) => (
          <li
            key={order.id}
            className="grid grid-cols-2 md:grid-cols-[1.1fr_1fr_1fr_0.9fr_0.9fr_0.8fr] gap-x-4 gap-y-2 px-5 py-5 items-center hover:bg-[#FAF9F5] transition-colors rounded-lg"
          >
            <div className="col-span-2 md:col-span-1 flex items-center justify-between md:block">
              <span className={`${FONT_MONO} text-sm text-[#1E2A22] font-medium`}>{order.poNumber}</span>
              <button
                type="button"
                className="md:hidden flex items-center gap-1 text-xs text-[#547A3D] font-medium"
              >
                <FiDownload /> Invoice
              </button>
            </div>

            <div>
              <span className="md:hidden text-xs text-gray-400 block">Date</span>
              <span className="text-sm text-gray-600">{order.date}</span>
            </div>

            <div>
              <span className="md:hidden text-xs text-gray-400 block">Category</span>
              <span className="text-sm text-gray-600">{order.category}</span>
            </div>

            <div>
              <span className="md:hidden text-xs text-gray-400 block">Units</span>
              <span className={`${FONT_MONO} text-sm text-gray-700`}>{UNITS_FORMATTER.format(order.units)}</span>
            </div>

            <div>
              <span className="md:hidden text-xs text-gray-400 block">Total</span>
              <span className="text-sm font-medium text-[#1E2A22]">{CURRENCY_FORMATTER.format(order.total)}</span>
            </div>

            <div className="flex items-center justify-between md:justify-start gap-3">
              <span
                className={`inline-flex items-center rounded-full text-xs font-medium px-3 py-1 ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
              <button
                type="button"
                title="Download invoice"
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-white hover:text-[#547A3D] hover:border-[#547A3D] transition-colors"
              >
                <FiDownload className="text-sm" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {orders.length === 0 && (
        <div className="py-16 text-center text-gray-400 text-sm">
          No purchase orders yet — place a bulk order to see it here.
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Addresses panel
// ---------------------------------------------------------------------------

interface AddressCardProps {
  address: Address;
  onSave: (address: Address) => void;
  onDelete: (id: string) => void;
}

const AddressCard = ({ address, onSave, onDelete }: AddressCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Address>(address);

  const updateField = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-xl border border-[#547A3D] bg-white p-5 space-y-3">
        <input
          value={draft.label}
          onChange={updateField("label")}
          placeholder="Address label (e.g. Warehouse)"
          className={`${inputClasses} py-2.5 text-sm font-medium`}
        />
        <input value={draft.company} onChange={updateField("company")} placeholder="Company" className={`${inputClasses} py-2.5`} />
        <input value={draft.contactName} onChange={updateField("contactName")} placeholder="Contact name" className={`${inputClasses} py-2.5`} />
        <input value={draft.line1} onChange={updateField("line1")} placeholder="Address line 1" className={`${inputClasses} py-2.5`} />
        <input value={draft.line2 ?? ""} onChange={updateField("line2")} placeholder="Address line 2 (optional)" className={`${inputClasses} py-2.5`} />
        <div className="grid grid-cols-3 gap-2">
          <input value={draft.city} onChange={updateField("city")} placeholder="City" className={`${inputClasses} py-2.5`} />
          <input value={draft.state} onChange={updateField("state")} placeholder="State" className={`${inputClasses} py-2.5`} />
          <input value={draft.zip} onChange={updateField("zip")} placeholder="ZIP" className={`${inputClasses} py-2.5`} />
        </div>
        <input value={draft.phone} onChange={updateField("phone")} placeholder="Phone" className={`${inputClasses} py-2.5`} />

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#547A3D] px-6 py-2 text-sm font-medium text-white hover:bg-[#456632] transition-colors"
          >
            Save address
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(address);
              setIsEditing(false);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#1E2A22]">{address.label}</h3>
          <div className="flex gap-1.5 mt-1.5">
            {address.isDefaultBilling && (
              <span className="text-[10px] uppercase tracking-wide bg-[#EAF2E6] text-[#3F6B2C] rounded-full px-2 py-0.5">
                Default billing
              </span>
            )}
            {address.isDefaultShipping && (
              <span className="text-[10px] uppercase tracking-wide bg-[#EAEEF3] text-[#3E5C7A] rounded-full px-2 py-0.5">
                Default shipping
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Edit address"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-[#547A3D] hover:bg-[#FAF9F5] transition-colors"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            title="Delete address"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-[#A34C3E] hover:bg-[#FAF9F5] transition-colors"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-700 font-medium">{address.company}</p>
      <p className="text-sm text-gray-500 mt-1">{address.contactName}</p>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}
        <br />
        {address.city}, {address.state} {address.zip}
        <br />
        {address.country}
      </p>
      <p className={`${FONT_MONO} text-xs text-gray-400 mt-3`}>{address.phone}</p>
    </div>
  );
};

const AddressesPanel = () => {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>(EMPTY_ADDRESS);

  const handleSaveExisting = (updated: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const updateNewField = (field: keyof Omit<Address, "id">) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.line1 || !newAddress.city) return;
    setAddresses((prev) => [...prev, { ...newAddress, id: crypto.randomUUID() }]);
    setNewAddress(EMPTY_ADDRESS);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeading eyebrow={`${addresses.length} Saved Locations`} title="My Address" />
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-full border border-[#547A3D] text-[#547A3D] px-5 py-2.5 text-sm font-medium hover:bg-[#547A3D] hover:text-white transition-colors"
          >
            <FiPlus /> Add address
          </button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-xl border border-[#547A3D] bg-white p-5 space-y-3 mb-6 max-w-xl">
          <input
            value={newAddress.label}
            onChange={updateNewField("label")}
            placeholder="Address label (e.g. Warehouse)"
            className={`${inputClasses} py-2.5 text-sm font-medium`}
          />
          <input value={newAddress.company} onChange={updateNewField("company")} placeholder="Company" className={`${inputClasses} py-2.5`} />
          <input value={newAddress.contactName} onChange={updateNewField("contactName")} placeholder="Contact name" className={`${inputClasses} py-2.5`} />
          <input value={newAddress.line1} onChange={updateNewField("line1")} placeholder="Address line 1" className={`${inputClasses} py-2.5`} />
          <input value={newAddress.line2} onChange={updateNewField("line2")} placeholder="Address line 2 (optional)" className={`${inputClasses} py-2.5`} />
          <div className="grid grid-cols-3 gap-2">
            <input value={newAddress.city} onChange={updateNewField("city")} placeholder="City" className={`${inputClasses} py-2.5`} />
            <input value={newAddress.state} onChange={updateNewField("state")} placeholder="State" className={`${inputClasses} py-2.5`} />
            <input value={newAddress.zip} onChange={updateNewField("zip")} placeholder="ZIP" className={`${inputClasses} py-2.5`} />
          </div>
          <input value={newAddress.phone} onChange={updateNewField("phone")} placeholder="Phone" className={`${inputClasses} py-2.5`} />

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleAddAddress}
              className="rounded-full bg-[#547A3D] px-6 py-2 text-sm font-medium text-white hover:bg-[#456632] transition-colors"
            >
              Save address
            </button>
            <button
              type="button"
              onClick={() => {
                setNewAddress(EMPTY_ADDRESS);
                setIsAdding(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} onSave={handleSaveExisting} onDelete={handleDelete} />
        ))}
      </div>

      {addresses.length === 0 && !isAdding && (
        <div className="py-16 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
          <FiTruck className="text-2xl" />
          No addresses saved yet — add a billing or shipping location.
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Security panel
// ---------------------------------------------------------------------------

const PASSWORD_MIN_LENGTH = 8;

const SecurityPanel = () => {
  const [form, setForm] = useState<PasswordForm>({ current: "", next: "", confirm: "" });
  const [visibility, setVisibility] = useState({ current: false, next: false, confirm: false });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSubmitted(false);
  };

  const toggleVisibility = (field: keyof typeof visibility) => () => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const lengthValid = form.next.length >= PASSWORD_MIN_LENGTH;
  const matchValid = form.next.length > 0 && form.next === form.confirm;
  const canSubmit = form.current.length > 0 && lengthValid && matchValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    setForm({ current: "", next: "", confirm: "" });
  };

  const renderPasswordField = (
    field: keyof PasswordForm,
    label: string,
    placeholder: string
  ) => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <input
          type={visibility[field] ? "text" : "password"}
          value={form[field]}
          onChange={updateField(field)}
          placeholder={placeholder}
          className={`${inputClasses} pr-11`}
        />
        <button
          type="button"
          onClick={toggleVisibility(field)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={visibility[field] ? "Hide password" : "Show password"}
        >
          {visibility[field] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeading eyebrow="Security" title="Change Password" />

      <form className="space-y-5 max-w-md" onSubmit={handleSubmit}>
        {renderPasswordField("current", "Current Password", "Enter current password")}
        {renderPasswordField("next", "New Password", "At least 8 characters")}
        {renderPasswordField("confirm", "Confirm New Password", "Re-enter new password")}

        <ul className="text-xs space-y-1 pt-1">
          <li className={lengthValid ? "text-[#3F6B2C]" : "text-gray-400"}>
            <FiCheck className="inline mr-1.5" />
            At least {PASSWORD_MIN_LENGTH} characters
          </li>
          <li className={matchValid ? "text-[#3F6B2C]" : "text-gray-400"}>
            <FiCheck className="inline mr-1.5" />
            Passwords match
          </li>
        </ul>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-[#547A3D] px-10 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-[#456632] hover:shadow-lg disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-[#547A3D] disabled:cursor-not-allowed"
          >
            UPDATE PASSWORD
          </button>
          {submitted && (
            <span className="flex items-center gap-1.5 text-sm text-[#3F6B2C]">
              <FiCheck /> Password updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------------
// UserProfile
// ---------------------------------------------------------------------------

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  const renderPanel = () => {
    switch (activeTab) {
      case "account":
        return <AccountInfoPanel />;
      case "orders":
        return <OrdersPanel />;
      case "addresses":
        return <AddressesPanel />;
      case "security":
        return <SecurityPanel />;
      default:
        return null;
    }
  };

  return (
    <>
      <ContactNav />
        <div className="max-w-7xl  mx-auto w-full">
          <div className="bg-white rounded-xl shadow-sm border border-[#E7E4DC] p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
              <div className="flex-1 min-w-0">{renderPanel()}</div>
            </div>
          </div>
        </div>
    </>
  );
};

export default UserProfile;