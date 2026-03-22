import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, StickyNote, Pin, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Note {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  color: string;
  fijada: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

const colores = [
  { name: 'Amarillo', value: 'bg-yellow-100 border-yellow-300' },
  { name: 'Verde', value: 'bg-green-100 border-green-300' },
  { name: 'Azul', value: 'bg-blue-100 border-blue-300' },
  { name: 'Rosa', value: 'bg-pink-100 border-pink-300' },
  { name: 'Morado', value: 'bg-purple-100 border-purple-300' },
  { name: 'Naranja', value: 'bg-orange-100 border-orange-300' },
];

const categorias = [
  'Personal',
  'Pacientes',
  'Inventario',
  'Finanzas',
  'Ideas',
  'Pendientes',
  'Otros'
];

const mockNotes: Note[] = [
  {
    id: 1,
    titulo: 'Recordatorio Importante',
    contenido: 'Llamar al proveedor de material dental para renovar el pedido mensual. Mencionar descuento del mes pasado.',
    categoria: 'Inventario',
    color: 'bg-yellow-100 border-yellow-300',
    fijada: true,
    fechaCreacion: '2026-02-10T10:00:00',
    fechaModificacion: '2026-02-10T10:00:00'
  },
  {
    id: 2,
    titulo: 'Paciente Especial - María García',
    contenido: 'Alergía al látex. Usar guantes de nitrilo siempre. Prefiere citas temprano por la mañana.',
    categoria: 'Pacientes',
    color: 'bg-pink-100 border-pink-300',
    fijada: true,
    fechaCreacion: '2026-02-08T14:30:00',
    fechaModificacion: '2026-02-08T14:30:00'
  },
  {
    id: 3,
    titulo: 'Ideas para Mejorar el Consultorio',
    contenido: 'Considerar instalar TV en sala de espera, actualizar sistema de música, agregar plantas decorativas.',
    categoria: 'Ideas',
    color: 'bg-green-100 border-green-300',
    fijada: false,
    fechaCreacion: '2026-02-05T09:15:00',
    fechaModificacion: '2026-02-09T16:20:00'
  },
  {
    id: 4,
    titulo: 'Gastos del Mes',
    contenido: 'Revisar facturas pendientes de: material dental ($5,000), servicios públicos ($1,200), limpieza ($800)',
    categoria: 'Finanzas',
    color: 'bg-blue-100 border-blue-300',
    fijada: false,
    fechaCreacion: '2026-02-01T11:00:00',
    fechaModificacion: '2026-02-01T11:00:00'
  },
];

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  const handleAddNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const now = new Date().toISOString();
    
    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? {
              ...note,
              titulo: formData.get('titulo') as string,
              contenido: formData.get('contenido') as string,
              categoria: formData.get('categoria') as string,
              color: formData.get('color') as string,
              fechaModificacion: now,
            }
          : note
      ));
      toast.success('Nota actualizada');
    } else {
      const newNote: Note = {
        id: notes.length + 1,
        titulo: formData.get('titulo') as string,
        contenido: formData.get('contenido') as string,
        categoria: formData.get('categoria') as string,
        color: formData.get('color') as string,
        fijada: false,
        fechaCreacion: now,
        fechaModificacion: now,
      };
      setNotes([newNote, ...notes]);
      toast.success('Nota creada exitosamente');
    }
    
    setDialogOpen(false);
    setEditingNote(null);
  };

  const togglePin = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, fijada: !note.fijada } : note
    ));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success('Nota eliminada');
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.contenido.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todas' || note.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.fijada && !b.fijada) return -1;
      if (!a.fijada && b.fijada) return 1;
      return new Date(b.fechaModificacion).getTime() - new Date(a.fechaModificacion).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Notas</h2>
          <p className="mt-1 text-sm text-gray-600">
            Guarda notas rápidas e importantes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingNote(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Nota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input 
                  id="titulo" 
                  name="titulo" 
                  required 
                  defaultValue={editingNote?.titulo}
                />
              </div>
              <div>
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea 
                  id="contenido" 
                  name="contenido" 
                  rows={6} 
                  required
                  defaultValue={editingNote?.contenido}
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <select 
                  id="categoria" 
                  name="categoria" 
                  required 
                  defaultValue={editingNote?.categoria}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <select 
                  id="color" 
                  name="color" 
                  required 
                  defaultValue={editingNote?.color}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colores.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingNote ? 'Actualizar Nota' : 'Crear Nota'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar en notas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Total Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{notes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Pin className="h-4 w-4" />
              Notas Fijadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">
              {notes.filter(n => n.fijada).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {new Set(notes.map(n => n.categoria)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(note => (
          <Card key={note.id} className={`${note.color} border-2 relative group`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {note.fijada && <Pin className="h-4 w-4 text-blue-600 fill-blue-600" />}
                    {note.titulo}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {note.categoria}
                  </Badge>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePin(note.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Pin className={`h-4 w-4 ${note.fijada ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNote(note.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                {note.contenido}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  {format(new Date(note.fechaModificacion), "d MMM yyyy", { locale: es })}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditDialog(note)}
                  className="text-xs"
                >
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <StickyNote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron notas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
