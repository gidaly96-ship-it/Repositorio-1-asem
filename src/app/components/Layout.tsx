import { Outlet, NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Bell, 
  FileText,
  Calendar,
  StickyNote,
  BookOpen,
  ShoppingCart,
  ListChecks,
  Calculator,
  Menu,
  X,
  Edit2
} from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { appName, setAppName, getTermPlural } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(appName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setAppName(tempName.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(appName);
    setIsEditing(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: getTermPlural(), href: '/pacientes', icon: Users },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Finanzas', href: '/finanzas', icon: DollarSign },
    { name: 'Recordatorios', href: '/recordatorios', icon: Bell },
    { name: 'Deudas', href: '/deudas', icon: FileText },
    { name: 'Notas', href: '/notas', icon: StickyNote },
    { name: 'Directorio', href: '/directorio', icon: BookOpen },
    { name: 'Lista Compras', href: '/compras', icon: ShoppingCart },
    { name: 'Checklists', href: '/checklists', icon: ListChecks },
    { name: 'Calculadora', href: '/calculadora', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-6 group">
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="text-sm"
                    placeholder="Nombre de tu negocio"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveName} className="flex-1 text-xs">
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1 text-xs">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-xl font-semibold text-blue-600">{appName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                    title="Editar nombre"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                  </button>
                </div>
              )}
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex min-h-0 flex-1 flex-col pt-5 pb-4">
              <div className="flex items-center justify-between px-6">
                <h1 className="text-xl font-semibold text-blue-600">{appName}</h1>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-8 flex-1 space-y-1 px-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/'}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center px-4">
            <h1 className="text-lg font-semibold text-blue-600">{appName}</h1>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}