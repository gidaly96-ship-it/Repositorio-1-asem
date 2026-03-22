import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Calendar as CalendarIcon, Clock, User, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

interface Appointment {
  id: number;
  paciente: string;
  especialidad: string;
  fecha: string;
  hora: string;
  duracion: number;
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  notas?: string;
}

const especialidades = [
  'Limpieza',
  'Ortodoncia',
  'Endodoncia',
  'Cirugía',
  'Periodoncia',
  'Implantes',
  'Estética',
  'Consulta General'
];

const mockAppointments: Appointment[] = [
  { id: 1, paciente: 'María García', especialidad: 'Ortodoncia', fecha: '2026-02-12', hora: '09:00', duracion: 60, status: 'confirmada' },
  { id: 2, paciente: 'Juan Pérez', especialidad: 'Limpieza', fecha: '2026-02-12', hora: '10:30', duracion: 45, status: 'confirmada' },
  { id: 3, paciente: 'Ana Martínez', especialidad: 'Endodoncia', fecha: '2026-02-12', hora: '14:00', duracion: 90, status: 'pendiente' },
  { id: 4, paciente: 'Carlos López', especialidad: 'Consulta General', fecha: '2026-02-13', hora: '09:30', duracion: 30, status: 'confirmada' },
  { id: 5, paciente: 'Laura Rodríguez', especialidad: 'Limpieza', fecha: '2026-02-13', hora: '11:00', duracion: 45, status: 'confirmada' },
  { id: 6, paciente: 'Pedro Sánchez', especialidad: 'Cirugía', fecha: '2026-02-14', hora: '08:00', duracion: 120, status: 'confirmada' },
  { id: 7, paciente: 'Sofia Torres', especialidad: 'Estética', fecha: '2026-02-14', hora: '15:00', duracion: 60, status: 'pendiente' },
  { id: 8, paciente: 'Miguel Ángel', especialidad: 'Implantes', fecha: '2026-02-15', hora: '10:00', duracion: 90, status: 'confirmada' },
];

export function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('todas');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      paciente: formData.get('paciente') as string,
      especialidad: formData.get('especialidad') as string,
      fecha: formData.get('fecha') as string,
      hora: formData.get('hora') as string,
      duracion: parseInt(formData.get('duracion') as string),
      status: 'pendiente',
      notas: formData.get('notas') as string || undefined,
    };

    setAppointments([...appointments, newAppointment].sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateA.getTime() - dateB.getTime();
    }));
    
    setDialogOpen(false);
    toast.success('Cita agendada exitosamente');
  };

  const updateStatus = (id: number, status: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    toast.success('Estado actualizado');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = selectedSpecialty === 'todas' 
    ? appointments 
    : appointments.filter(apt => apt.especialidad === selectedSpecialty);

  // Get week days
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(apt => apt.fecha === dateStr);
  };

  const totalBySpecialty = especialidades.map(esp => ({
    especialidad: esp,
    count: appointments.filter(apt => apt.especialidad === esp).length
  })).filter(item => item.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Agenda de Citas</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona las citas de tus pacientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <Label htmlFor="paciente">Paciente</Label>
                <Input id="paciente" name="paciente" required />
              </div>
              <div>
                <Label htmlFor="especialidad">Especialidad</Label>
                <select 
                  id="especialidad" 
                  name="especialidad" 
                  required 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" name="fecha" type="date" required />
                </div>
                <div>
                  <Label htmlFor="hora">Hora</Label>
                  <Input id="hora" name="hora" type="time" required />
                </div>
              </div>
              <div>
                <Label htmlFor="duracion">Duración (minutos)</Label>
                <Input id="duracion" name="duracion" type="number" defaultValue={45} required />
              </div>
              <div>
                <Label htmlFor="notas">Notas (opcional)</Label>
                <Input id="notas" name="notas" />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Agendar Cita
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {appointments.filter(a => a.status === 'confirmada').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-yellow-600">
              {appointments.filter(a => a.status === 'pendiente').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Esta Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.fecha);
                return aptDate >= weekStart && aptDate < addWeeks(weekStart, 1);
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="semana">
        <TabsList>
          <TabsTrigger value="semana">Vista Semanal</TabsTrigger>
          <TabsTrigger value="lista">Lista Completa</TabsTrigger>
          <TabsTrigger value="especialidad">Por Especialidad</TabsTrigger>
        </TabsList>

        {/* Weekly View */}
        <TabsContent value="semana" className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              ← Semana Anterior
            </Button>
            <h3 className="font-semibold">
              {format(weekStart, 'd', { locale: es })} - {format(addDays(weekStart, 6), "d 'de' MMMM yyyy", { locale: es })}
            </h3>
            <Button variant="outline" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              Semana Siguiente →
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las especialidades</SelectItem>
                {especialidades.map(esp => (
                  <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day, idx) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <Card key={idx} className={isToday ? 'border-blue-500 border-2' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      <div className={`text-center ${isToday ? 'text-blue-600' : ''}`}>
                        <div className="font-semibold">
                          {format(day, 'EEE', { locale: es }).toUpperCase()}
                        </div>
                        <div className="text-2xl">
                          {format(day, 'd')}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dayAppointments.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center">Sin citas</p>
                    ) : (
                      dayAppointments.map(apt => (
                        <div 
                          key={apt.id}
                          className="p-2 bg-gray-50 rounded border-l-4 border-blue-500 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="text-xs font-semibold text-gray-900">{apt.hora}</div>
                          <div className="text-xs text-gray-700">{apt.paciente}</div>
                          <div className="text-xs text-gray-500">{apt.especialidad}</div>
                          <Badge className={`${getStatusColor(apt.status)} text-xs mt-1`}>
                            {apt.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="lista" className="space-y-3">
          {appointments.map(apt => (
            <Card key={apt.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{apt.paciente}</h3>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(apt.fecha), "d 'de' MMMM yyyy", { locale: es })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {apt.hora} ({apt.duracion} min)
                      </span>
                      <Badge variant="outline">{apt.especialidad}</Badge>
                    </div>
                    {apt.notas && (
                      <p className="text-sm text-gray-500 ml-8">{apt.notas}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pendiente' && (
                      <Button size="sm" onClick={() => updateStatus(apt.id, 'confirmada')}>
                        Confirmar
                      </Button>
                    )}
                    {apt.status === 'confirmada' && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, 'completada')}>
                        Completar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* By Specialty */}
        <TabsContent value="especialidad" className="space-y-4">
          {totalBySpecialty.map(({ especialidad, count }) => (
            <Card key={especialidad}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{especialidad}</CardTitle>
                  <Badge>{count} citas</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {appointments
                  .filter(apt => apt.especialidad === especialidad)
                  .map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{apt.paciente}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(apt.fecha), "d 'de' MMMM", { locale: es })} • {apt.hora}
                        </p>
                      </div>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}