import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, ListChecks, Trash2, Edit2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistItem {
  id: number;
  texto: string;
  completado: boolean;
}

interface Checklist {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string;
  items: ChecklistItem[];
  fechaCreacion: string;
}

const colores = [
  { name: 'Azul', value: 'bg-blue-100 border-blue-300' },
  { name: 'Verde', value: 'bg-green-100 border-green-300' },
  { name: 'Amarillo', value: 'bg-yellow-100 border-yellow-300' },
  { name: 'Rosa', value: 'bg-pink-100 border-pink-300' },
  { name: 'Morado', value: 'bg-purple-100 border-purple-300' },
  { name: 'Naranja', value: 'bg-orange-100 border-orange-300' },
];

const mockChecklists: Checklist[] = [
  {
    id: 1,
    nombre: 'Protocolo de Apertura Diaria',
    descripcion: 'Pasos para abrir el consultorio cada día',
    color: 'bg-blue-100 border-blue-300',
    fechaCreacion: '2026-01-15T08:00:00',
    items: [
      { id: 1, texto: 'Encender luces y aire acondicionado', completado: true },
      { id: 2, texto: 'Revisar agenda del día', completado: true },
      { id: 3, texto: 'Preparar instrumental básico', completado: true },
      { id: 4, texto: 'Encender equipo de esterilización', completado: false },
      { id: 5, texto: 'Verificar stock de materiales', completado: false },
      { id: 6, texto: 'Confirmar citas del día', completado: false },
    ]
  },
  {
    id: 2,
    nombre: 'Limpieza de Consultorio',
    descripcion: 'Lista de limpieza y desinfección',
    color: 'bg-green-100 border-green-300',
    fechaCreacion: '2026-01-20T10:00:00',
    items: [
      { id: 1, texto: 'Desinfectar sillón dental', completado: true },
      { id: 2, texto: 'Limpiar lámpara y unidad dental', completado: true },
      { id: 3, texto: 'Desinfectar superficies de trabajo', completado: false },
      { id: 4, texto: 'Limpiar piso y mobiliario', completado: false },
      { id: 5, texto: 'Vaciar contenedores de residuos', completado: false },
      { id: 6, texto: 'Reponer insumos de limpieza', completado: false },
    ]
  },
  {
    id: 3,
    nombre: 'Inventario Mensual',
    descripcion: 'Revisión de stock mensual',
    color: 'bg-yellow-100 border-yellow-300',
    fechaCreacion: '2026-02-01T09:00:00',
    items: [
      { id: 1, texto: 'Contar guantes y cubrebocas', completado: false },
      { id: 2, texto: 'Verificar anestésicos', completado: false },
      { id: 3, texto: 'Revisar material de impresión', completado: false },
      { id: 4, texto: 'Contar jeringas y agujas', completado: false },
      { id: 5, texto: 'Actualizar lista de compras', completado: false },
    ]
  },
];

export function Checklists() {
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null);

  const handleCreateChecklist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingChecklist) {
      setChecklists(checklists.map(cl => 
        cl.id === editingChecklist.id 
          ? {
              ...cl,
              nombre: formData.get('nombre') as string,
              descripcion: formData.get('descripcion') as string || undefined,
              color: formData.get('color') as string,
            }
          : cl
      ));
      toast.success('Checklist actualizada');
    } else {
      const newChecklist: Checklist = {
        id: checklists.length + 1,
        nombre: formData.get('nombre') as string,
        descripcion: formData.get('descripcion') as string || undefined,
        color: formData.get('color') as string,
        items: [],
        fechaCreacion: new Date().toISOString(),
      };
      setChecklists([...checklists, newChecklist]);
      toast.success('Checklist creada exitosamente');
    }
    
    setDialogOpen(false);
    setEditingChecklist(null);
  };

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedChecklistId) return;

    const formData = new FormData(e.currentTarget);
    const texto = formData.get('texto') as string;

    setChecklists(checklists.map(cl => {
      if (cl.id === selectedChecklistId) {
        const newItem: ChecklistItem = {
          id: cl.items.length + 1,
          texto,
          completado: false,
        };
        return { ...cl, items: [...cl.items, newItem] };
      }
      return cl;
    }));

    setItemDialogOpen(false);
    toast.success('Item agregado');
  };

  const toggleItem = (checklistId: number, itemId: number) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map(item => 
            item.id === itemId ? { ...item, completado: !item.completado } : item
          )
        };
      }
      return cl;
    }));
  };

  const deleteItem = (checklistId: number, itemId: number) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.filter(item => item.id !== itemId)
        };
      }
      return cl;
    }));
    toast.success('Item eliminado');
  };

  const deleteChecklist = (id: number) => {
    setChecklists(checklists.filter(cl => cl.id !== id));
    toast.success('Checklist eliminada');
  };

  const duplicateChecklist = (checklist: Checklist) => {
    const newChecklist: Checklist = {
      ...checklist,
      id: checklists.length + 1,
      nombre: `${checklist.nombre} (Copia)`,
      fechaCreacion: new Date().toISOString(),
      items: checklist.items.map(item => ({ ...item, completado: false })),
    };
    setChecklists([...checklists, newChecklist]);
    toast.success('Checklist duplicada');
  };

  const resetChecklist = (id: number) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === id) {
        return {
          ...cl,
          items: cl.items.map(item => ({ ...item, completado: false }))
        };
      }
      return cl;
    }));
    toast.success('Checklist reiniciada');
  };

  const openEditDialog = (checklist: Checklist) => {
    setEditingChecklist(checklist);
    setDialogOpen(true);
  };

  const openItemDialog = (checklistId: number) => {
    setSelectedChecklistId(checklistId);
    setItemDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Checklists</h2>
          <p className="mt-1 text-sm text-gray-600">
            Crea y gestiona múltiples listas de verificación
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingChecklist(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Checklist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingChecklist ? 'Editar Checklist' : 'Nueva Checklist'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateChecklist} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Checklist</Label>
                <Input 
                  id="nombre" 
                  name="nombre" 
                  required 
                  defaultValue={editingChecklist?.nombre}
                  placeholder="Ej: Protocolo de Apertura"
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Input 
                  id="descripcion" 
                  name="descripcion"
                  defaultValue={editingChecklist?.descripcion}
                  placeholder="Breve descripción de la checklist"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <select 
                  id="color" 
                  name="color" 
                  required 
                  defaultValue={editingChecklist?.color}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colores.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingChecklist ? 'Actualizar Checklist' : 'Crear Checklist'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Checklists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{checklists.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {checklists.reduce((sum, cl) => sum + cl.items.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Items Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {checklists.reduce((sum, cl) => 
                sum + cl.items.filter(item => item.completado).length, 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {checklists.map(checklist => {
          const completedItems = checklist.items.filter(item => item.completado).length;
          const totalItems = checklist.items.length;
          const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

          return (
            <Card key={checklist.id} className={`${checklist.color} border-2`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5" />
                      {checklist.nombre}
                    </CardTitle>
                    {checklist.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{checklist.descripcion}</p>
                    )}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-semibold">
                          {completedItems} / {totalItems} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(checklist)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => duplicateChecklist(checklist)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteChecklist(checklist.id)}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {checklist.items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay items en esta checklist
                  </p>
                ) : (
                  checklist.items.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-2 bg-white/50 rounded">
                      <Checkbox
                        checked={item.completado}
                        onCheckedChange={() => toggleItem(checklist.id, item.id)}
                        className="mt-0.5"
                      />
                      <span className={`flex-1 text-sm ${item.completado ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.texto}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteItem(checklist.id, item.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openItemDialog(checklist.id)}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Item
                  </Button>
                  {totalItems > 0 && completedItems > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetChecklist(checklist.id)}
                    >
                      Reiniciar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {checklists.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <ListChecks className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes checklists creadas</p>
            <p className="text-sm text-gray-400 mt-1">Crea tu primera checklist para comenzar</p>
          </CardContent>
        </Card>
      )}

      {/* Add Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <Label htmlFor="texto">Descripción del Item</Label>
              <Input 
                id="texto" 
                name="texto" 
                required 
                placeholder="Ej: Revisar instrumental"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Agregar Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
