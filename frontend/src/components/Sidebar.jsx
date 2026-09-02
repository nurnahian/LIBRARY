import { useState } from "react";
import { Link, useLocation } from "react-router";
import { sidebarStyles as s } from "../assets/dummyStyles";
import {
  Bell,
  BookCopy,
  ChartNoAxesCombined,
  ChevronRight,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

const iconMap = {
  dashboard: ChartNoAxesCombined,
  book: BookCopy,
  alerts: Bell,
  admin: ShieldCheck,
  users: UserRound,
};

const Sidebar = ({
  title,
  subtitle,
  badge,
  navItems,
  footerItems = [],
  accent = "user",
  logoSrc,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const badgeStyles = accent === "admin" ? s.badgeAdmin : s.badgeUser;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={s.mobileMenuButton}
      >
        <Menu size={18} />
      </button>

      <div
        className={`${s.mobileOverlay}${open ? s.mobileOverlay : s.mobileOverlayClosed}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`${s.sidebar} ${open ? s.sidebarOpen : s.sidebarClosed}`}
      >
        <div className={s.sidebarHeader}>
          <div className="min-w-0 pr-3">
            <div className={s.logoWrapper}>
              {logoSrc ? (
                <img src={logoSrc} alt="logo" className={s.logoImage} />
              ) : (
                <BookCopy size={22} />
              )}
            </div>
            <h2 className={s.title}>{title}</h2>
            <p className={s.subtitle}>{subtitle}</p>
            {badge && (
              <span className={`${s.badgeBase} ${badgeStyles}`}>{badge}</span>
            )}
          </div>
          <button
            type="button"
            className={s.closeButton}
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className={s.nav}>
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? ChevronRight;
            const active =
              location.pathname === item.href ||
              (item.match ? location.pathname.startsWith(item.match) : false);
            return <Link key={item.label} to={item.href} onClick={()=>setOpen(false)} className={`${s.navLink} ${active?s.navLinkActive:s.navLinkInactive}`}>
              <span>
                
              </span>
            </Link>;
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
