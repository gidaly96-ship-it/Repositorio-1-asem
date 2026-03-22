import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Plus, Search, Phone, Mail, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';

interface Patient {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  proximaCita: string;
  deuda: number;
  status: 'activo' | 'inactivo';
}

const mockPatients: Patient[] = [
  { id: 1, nombre: 'María García', telefono: '555-0101', email: 'maria@email.com', proximaCita: '2026-02-15', deuda: 2500, status: 'activo' },
  { id: 2, nombre: 'Juan Pérez', telefono: '555-0102', email: 'juan@email.com', proximaCita: '2026-02-18', deuda: 0, status: 'activo' },
  { id: 3, nombre: 'Ana Martínez', telefono: '555-0103', email: 'ana@email.com', proximaCita: '2026-02-20', deuda: 1500, status: 'activo' },
  { id: 4, nombre: 'Carlos López', telefono: '555-0104', email: 'carlos@email.com', proximaCita: '2026-02-22', deuda: 3000, status: 'activo' },
  { id: 5, nombre: 'Laura Rodríguez', telefono: '555-0105', email: 'laura@email.com', proximaCita: '2026-03-01', deuda: 0, status: 'activo' },
];

export function Patients() {
  const { getTermPlural, getTermSingular } = useApp();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telefono.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPatient: Patient = {
      id: patients.length + 1,
      nombre: formData.get('nombre') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      proximaCita: formData.get('proximaCita') as string,
      deuda: 0,
      status: 'activo',
    };

    setPatients([...patients, newPatient]);
    setDialogOpen(false);
    toast.success(`${getTermSingular()} agregado exitosamente`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{getTermPlural()}</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona la información de tus {getTermPlural().toLowerCase()}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo {getTermSingular()}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo {getTermSingular()}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input id="nombre" name="nombre" required />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="proximaCita">Próxima Cita</Label>
                <Input id="proximaCita" name="proximaCita" type="date" required />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Agregar {getTermSingular()}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, teléfono o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-2 md:space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{patient.nombre}</h3>
                    <Badge variant={patient.status === 'activo' ? 'default' : 'secondary'}>
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {patient.telefono}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(patient.proximaCita).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex items-center gap-3">
                  {patient.deuda > 0 && (
                    <Badge variant="destructive">
                      Debe: ${patient.deuda.toLocaleString()}
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total {getTermPlural()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{getTermPlural()} Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">
              {patients.filter(p => p.status === 'activo').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Con Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-600">
              {patients.filter(p => p.deuda > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}