import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity,
  FolderTree,
  Gauge,
  Globe,
  LayoutDashboard,
  Languages,
  LogOut,
  Menu,
  Moon,
  Network,
  ScrollText,
  Server,
  Settings as SettingsIcon,
  Sun,
  X,
} from 'lucide-react';
import { useApp } from '../app-context';
import { LANGUAGES, type Dict } from '../i18n';
import { logoUrl } from '../api';

const NAV: { to: string; key: keyof Dict; icon: typeof Gauge }[] = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard },
  { to: '/sites', key: 'websites', icon: Server },
  { to: '/domains', key: 'domains', icon: Globe },
  { to: '/files', key: 'files', icon: FolderTree },
  { to: '/monitoring', key: 'monitoring', icon: Activity },
  { to: '/network', key: 'network', icon: Network },
  { to: '/logs', key: 'logs', icon: ScrollText },
  { to: '/site-server', key: 'siteServer', icon: Gauge },
  { to: '/settings', key: 'settings', icon: SettingsIcon },
];

export default function Layout() {
  const { t, serverName, hasLogo, resolvedTheme, setTheme, lang, setLang, logout, connected, username } = useApp();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => setLangOpen(false), [location.pathname]);

  const nav = (
    <nav className="flex flex-col gap-1 p-3" aria-label={t('appName')}>
      {NAV.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition duration-150 ${
              isActive
                ? 'nav-active font-semibold text-brand'
                : 'text-ink-soft hover:bg-surface-raised hover:text-ink'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                  isActive ? 'bg-brand text-white shadow-sm' : 'bg-surface-sunken text-ink-muted group-hover:text-ink'
                }`}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
              </span>
              <span className="truncate">{t(key)}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex h-full overflow-hidden bg-surface-sunken">
      {/* نوار کناری — دسکتاپ */}
      <aside className="hidden w-64 shrink-0 flex-col border-e border-line bg-surface lg:flex">
        <Brand serverName={serverName} hasLogo={hasLogo} subtitle={t('appName')} />
        <div className="min-h-0 flex-1 overflow-y-auto py-1">{nav}</div>
        <footer className="border-t border-line px-4 py-3">
          {username && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-state-good" />
              <p className="truncate" title={username}>{username}</p>
            </div>
          )}
        </footer>
      </aside>

      {/* کشوی موبایل */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="close navigation"
          />
          <aside className="absolute inset-y-0 start-0 flex w-[min(18rem,86vw)] flex-col border-e border-line bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line">
              <Brand serverName={serverName} hasLogo={hasLogo} subtitle={t('appName')} compact />
              <button className="icon-btn me-3" onClick={() => setOpen(false)} aria-label="close navigation">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto py-1">{nav}</div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="topbar-glass sticky top-0 z-30 flex min-h-14 items-center gap-2 border-b border-line px-3 py-2 backdrop-blur-xl sm:px-5">
          <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="menu">
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight text-ink">{serverName || t('appName')}</p>
            <p className="hidden truncate text-[11px] text-ink-muted sm:block">{t('appName')}</p>
          </div>

          <span
            className="chip hidden sm:inline-flex"
            title={connected ? t('online') : t('reconnecting')}
            style={{
              background: connected
                ? 'color-mix(in srgb, var(--status-good) 11%, transparent)'
                : 'color-mix(in srgb, var(--status-warning) 12%, transparent)',
              color: connected ? 'var(--status-good)' : 'var(--status-warning)',
              borderColor: connected
                ? 'color-mix(in srgb, var(--status-good) 22%, transparent)'
                : 'color-mix(in srgb, var(--status-warning) 22%, transparent)',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: connected ? 'var(--status-good)' : 'var(--status-warning)' }}
            />
            {connected ? t('online') : t('reconnecting')}
          </span>

          <span
            className="h-2 w-2 rounded-full sm:hidden"
            title={connected ? t('online') : t('reconnecting')}
            style={{ background: connected ? 'var(--status-good)' : 'var(--status-warning)' }}
          />

          <div className="relative">
            <button
              className="btn btn-sm"
              onClick={() => setLangOpen((v) => !v)}
              aria-label={t('language')}
              aria-expanded={langOpen}
            >
              <Languages className="h-4 w-4" />
              <span className="hidden md:inline">{LANGUAGES.find((l) => l.code === lang)?.label}</span>
            </button>
            {langOpen && (
              <>
                <button className="fixed inset-0 z-10 cursor-default" onClick={() => setLangOpen(false)} aria-label="close language menu" />
                <ul
                  className="card-raised absolute end-0 z-20 mt-2 w-40 overflow-hidden p-1.5"
                  style={{ background: 'var(--surface-2)' }}
                >
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <button
                        className={`min-h-10 w-full rounded-lg px-3 py-2 text-start text-sm transition hover:bg-surface-raised ${
                          l.code === lang ? 'font-semibold text-brand' : 'text-ink-soft'
                        }`}
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <button
            className="icon-btn h-9 w-9"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label={t('theme')}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button className="btn btn-sm" onClick={logout} aria-label={t('logout')}>
            <LogOut className="h-4 w-4" />
            <span className="hidden xl:inline">{t('logout')}</span>
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-surface-sunken p-3 sm:p-5 lg:p-6">
          <div className="page-shell">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function Brand({
  serverName,
  hasLogo,
  subtitle,
  compact = false,
}: {
  serverName: string;
  hasLogo: boolean;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${compact ? 'p-3.5' : 'border-b border-line p-4'}`}>
      {hasLogo ? (
        <img src={logoUrl()} alt="" className="h-9 w-9 shrink-0 rounded-xl border border-line object-cover shadow-sm" />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
          <Server className="h-[18px] w-[18px]" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-ink">{serverName || subtitle}</p>
        <p className="truncate text-[11px] text-ink-muted">{subtitle}</p>
      </div>
    </div>
  );
}
