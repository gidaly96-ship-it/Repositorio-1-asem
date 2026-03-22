import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  appName: string;
  setAppName: (name: string) => void;
  getTermSingular: () => string;
  getTermPlural: () => string;
  isHealthRelated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const healthKeywords = [
  'consultorio',
  'dental',
  'clínica',
  'clinic',
  'clinica',
  'odontología',
  'odontologia',
  'doctor',
  'dr.',
  'dra.',
  'médico',
  'medico',
  'salud',
  'health',
  'hospital',
  'centro médico',
  'centro medico',
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [appName, setAppNameState] = useState('Consultorio Dental');

  useEffect(() => {
    const savedName = localStorage.getItem('app-name');
    if (savedName) {
      setAppNameState(savedName);
    }
  }, []);

  const setAppName = (name: string) => {
    setAppNameState(name);
    localStorage.setItem('app-name', name);
  };

  const isHealthRelated = healthKeywords.some(keyword => 
    appName.toLowerCase().includes(keyword)
  );

  const getTermSingular = () => isHealthRelated ? 'Paciente' : 'Cliente';
  const getTermPlural = () => isHealthRelated ? 'Pacientes' : 'Clientes';

  return (
    <AppContext.Provider value={{ 
      appName, 
      setAppName, 
      getTermSingular, 
      getTermPlural,
      isHealthRelated 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
