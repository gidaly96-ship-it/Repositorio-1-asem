import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Plus, Bell, DollarSign, Megaphone, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Reminder {
  id: number;
  tipo: 'pago' | 'publicidad';
  titulo: string;
  descripcion: string;
  fecha: string;
  completado: boolean;
  prioridad: 'alta' | 'media' | 'baja';
}

const mockReminders: Reminder[] = [
  { id: 1, tipo: 'pago', titulo: 'Pago pendiente - María García', descripcion: 'Cobrar $2,500 de tratamiento de ortodoncia', fecha: '2026-02-12', completado: false, prioridad: 'alta' },
  { id: 2, tipo: 'publicidad', titulo: 'Publicar en redes sociales', descripcion: 'Campaña de limpieza dental con descuento 20%', fecha: '2026-02-11', completado: false, prioridad: 'media' },
  { id: 3, tipo: 'pago', titulo: 'Recordatorio - Carlos López', descripcion: 'Seguimiento de pago de endodoncia ($3,000)', fecha: '2026-02-13', completado: false, prioridad: 'alta' },
  { id: 4, tipo: 'publicidad', titulo: 'Actualizar sitio web', descripcion: 'Agregar testimonios de pacientes nuevos', fecha: '2026-02-15', completado: false, prioridad: 'baja' },
  { id: 5, tipo: 'pago', titulo: 'Pago parcial - Ana Martínez', descripcion: 'Cobrar segundo pago de $1,500', fecha: '2026-02-14', completado: false, prioridad: 'media' },
  { id: 6, tipo: 'publicidad', titulo: 'Campaña Google Ads', descripcion: 'Renovar campaña publicitaria mensual', fecha: '2026-02-20', completado: false, prioridad: 'alta' },
];

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newReminder: Reminder = {
      id: reminders.length + 1,
      tipo: formData.get('tipo') as 'pago' | 'publicidad',
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
      fecha: formData.get('fecha') as string,
      completado: false,
      prioridad: formData.get('prioridad') as 'alta' | 'media' | 'baja',
    };

    setReminders([...reminders, newReminder].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()));
    setDialogOpen(false);
    toast.success('Recordatorio creado exitosamente');
  };

  const toggleComplete = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completado: !r.completado } : r
    ));
    toast.success('Estado actualizado');
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingPayments = reminders.filter(r => r.tipo === 'pago' && !r.completado);
  const pendingAds = reminders.filter(r => r.tipo === 'publicidad' && !r.completado);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Recordatorios</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona recordatorios de pagos y publicidad
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Recordatorio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Recordatorio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <select 
                  id="tipo" 
                  name="tipo" 
                  required 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pago">Pago Pendiente</option>
                  <option value="publicidad">Publicidad</option>
                </select>
              </div>
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" required />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" name="descripcion" required />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" name="fecha" type="date" required />
              </div>
              <div>
                <Label htmlFor="prioridad">Prioridad</Label>
                <select 
                  id="prioridad" 
                  name="prioridad" 
                  required 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Crear Recordatorio
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pagos Pendientes
            </CardTitle>
            <DollarSign className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pendingPayments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Publicidad Pendiente
            </CardTitle>
            <Megaphone className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pendingAds.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Recordatorios
            </CardTitle>
            <Bell className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{reminders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Recordatorios</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pagos">Pagos</TabsTrigger>
              <TabsTrigger value="publicidad">Publicidad</TabsTrigger>
              <TabsTrigger value="completados">Completados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="todos" className="space-y-3 mt-4">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg ${reminder.completado ? 'bg-gray-50 opacity-60' : ''}`}
                >
                  <button
                    onClick={() => toggleComplete(reminder.id)}
                    className="mt-1"
                  >
                    <CheckCircle2 
                      className={`h-5 w-5 ${reminder.completado ? 'text-green-600 fill-green-600' : 'text-gray-300'}`}
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {reminder.tipo === 'pago' ? (
                            <DollarSign className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Megaphone className="h-4 w-4 text-purple-600" />
                          )}
                          <h3 className={`font-medium ${reminder.completado ? 'line-through' : ''}`}>
                            {reminder.titulo}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.descripcion}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(reminder.fecha).toLocaleDateString('es-MX', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(reminder.prioridad)}>
                        {reminder.prioridad}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="pagos" className="space-y-3 mt-4">
              {reminders.filter(r => r.tipo === 'pago').map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg ${reminder.completado ? 'bg-gray-50 opacity-60' : ''}`}
                >
                  <button
                    onClick={() => toggleComplete(reminder.id)}
                    className="mt-1"
                  >
                    <CheckCircle2 
                      className={`h-5 w-5 ${reminder.completado ? 'text-green-600 fill-green-600' : 'text-gray-300'}`}
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-orange-600" />
                          <h3 className={`font-medium ${reminder.completado ? 'line-through' : ''}`}>
                            {reminder.titulo}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.descripcion}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(reminder.fecha).toLocaleDateString('es-MX', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(reminder.prioridad)}>
                        {reminder.prioridad}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="publicidad" className="space-y-3 mt-4">
              {reminders.filter(r => r.tipo === 'publicidad').map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg ${reminder.completado ? 'bg-gray-50 opacity-60' : ''}`}
                >
                  <button
                    onClick={() => toggleComplete(reminder.id)}
                    className="mt-1"
                  >
                    <CheckCircle2 
                      className={`h-5 w-5 ${reminder.completado ? 'text-green-600 fill-green-600' : 'text-gray-300'}`}
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Megaphone className="h-4 w-4 text-purple-600" />
                          <h3 className={`font-medium ${reminder.completado ? 'line-through' : ''}`}>
                            {reminder.titulo}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.descripcion}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(reminder.fecha).toLocaleDateString('es-MX', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(reminder.prioridad)}>
                        {reminder.prioridad}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="completados" className="space-y-3 mt-4">
              {reminders.filter(r => r.completado).map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60"
                >
                  <button
                    onClick={() => toggleComplete(reminder.id)}
                    className="mt-1"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600 fill-green-600" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {reminder.tipo === 'pago' ? (
                            <DollarSign className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Megaphone className="h-4 w-4 text-purple-600" />
                          )}
                          <h3 className="font-medium line-through">
                            {reminder.titulo}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.descripcion}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(reminder.fecha).toLocaleDateString('es-MX', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(reminder.prioridad)}>
                        {reminder.prioridad}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
