import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Plus, ShoppingCart, Trash2, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface ShoppingItem {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  prioridad: 'alta' | 'media' | 'baja';
  completado: boolean;
  notas?: string;
}

interface ProviderPrice {
  proveedor: string;
  precio: number;
  cantidad: number;
  unidad: string;
  tiempoEntrega: string;
  calificacion: number;
}

const categorias = [
  'Material Dental',
  'Medicamentos',
  'Limpieza',
  'Oficina',
  'Protección Personal',
  'Instrumental',
  'Otros'
];

const unidades = ['Pieza', 'Caja', 'Paquete', 'Litro', 'Kilogramo', 'Unidad'];

const mockItems: ShoppingItem[] = [
  { id: 1, nombre: 'Guantes de nitrilo', cantidad: 10, unidad: 'Caja', categoria: 'Protección Personal', prioridad: 'alta', completado: false, notas: 'Talla M' },
  { id: 2, nombre: 'Anestesia local', cantidad: 5, unidad: 'Caja', categoria: 'Medicamentos', prioridad: 'alta', completado: false },
  { id: 3, nombre: 'Algodón dental', cantidad: 3, unidad: 'Paquete', categoria: 'Material Dental', prioridad: 'media', completado: false },
  { id: 4, nombre: 'Desinfectante de superficies', cantidad: 2, unidad: 'Litro', categoria: 'Limpieza', prioridad: 'media', completado: false },
  { id: 5, nombre: 'Papel para autoclave', cantidad: 2, unidad: 'Paquete', categoria: 'Material Dental', prioridad: 'baja', completado: true },
  { id: 6, nombre: 'Jeringas desechables', cantidad: 20, unidad: 'Pieza', categoria: 'Material Dental', prioridad: 'alta', completado: false },
  { id: 7, nombre: 'Hojas de papel', cantidad: 1, unidad: 'Paquete', categoria: 'Oficina', prioridad: 'baja', completado: true },
];

// Mock data for provider comparison
const mockProviderPrices: Record<string, ProviderPrice[]> = {
  'Guantes de nitrilo': [
    { proveedor: 'Dental Supply Pro', precio: 450, cantidad: 1, unidad: 'Caja (100 pz)', tiempoEntrega: '24 hrs', calificacion: 5 },
    { proveedor: 'MediDental MX', precio: 420, cantidad: 1, unidad: 'Caja (100 pz)', tiempoEntrega: '48 hrs', calificacion: 4 },
    { proveedor: 'Distribuidora Global', precio: 480, cantidad: 1, unidad: 'Caja (100 pz)', tiempoEntrega: '24 hrs', calificacion: 4 },
    { proveedor: 'Suministros Médicos', precio: 395, cantidad: 1, unidad: 'Caja (100 pz)', tiempoEntrega: '3-5 días', calificacion: 3 },
  ],
  'Anestesia local': [
    { proveedor: 'Farmacia Dental Pro', precio: 1250, cantidad: 1, unidad: 'Caja (50 cart)', tiempoEntrega: '24 hrs', calificacion: 5 },
    { proveedor: 'Distribuidora Médica', precio: 1180, cantidad: 1, unidad: 'Caja (50 cart)', tiempoEntrega: '48 hrs', calificacion: 4 },
    { proveedor: 'Dental Supply Pro', precio: 1300, cantidad: 1, unidad: 'Caja (50 cart)', tiempoEntrega: '24 hrs', calificacion: 5 },
    { proveedor: 'Importadora Dental', precio: 1150, cantidad: 1, unidad: 'Caja (50 cart)', tiempoEntrega: '5-7 días', calificacion: 3 },
  ],
  'Algodón dental': [
    { proveedor: 'Dental Supply Pro', precio: 85, cantidad: 1, unidad: 'Paquete (500g)', tiempoEntrega: '24 hrs', calificacion: 5 },
    { proveedor: 'MediDental MX', precio: 78, cantidad: 1, unidad: 'Paquete (500g)', tiempoEntrega: '48 hrs', calificacion: 4 },
    { proveedor: 'Algodones del Norte', precio: 72, cantidad: 1, unidad: 'Paquete (500g)', tiempoEntrega: '3-5 días', calificacion: 4 },
    { proveedor: 'Distribuidora Global', precio: 90, cantidad: 1, unidad: 'Paquete (500g)', tiempoEntrega: '24 hrs', calificacion: 4 },
  ],
};

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(mockItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem: ShoppingItem = {
      id: items.length + 1,
      nombre: formData.get('nombre') as string,
      cantidad: parseInt(formData.get('cantidad') as string),
      unidad: formData.get('unidad') as string,
      categoria: formData.get('categoria') as string,
      prioridad: formData.get('prioridad') as 'alta' | 'media' | 'baja',
      completado: false,
      notas: formData.get('notas') as string || undefined,
    };

    setItems([...items, newItem]);
    setDialogOpen(false);
    toast.success('Artículo agregado a la lista');
  };

  const toggleComplete = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completado: !item.completado } : item
    ));
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Artículo eliminado');
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.completado));
    toast.success('Artículos completados eliminados');
  };

  const openCompareDialog = (item: ShoppingItem) => {
    setSelectedItem(item);
    setCompareDialogOpen(true);
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingItems = items.filter(item => !item.completado);
  const completedItems = items.filter(item => item.completado);
  const highPriorityItems = pendingItems.filter(item => item.prioridad === 'alta');

  const itemsByCategory = categorias.map(cat => ({
    categoria: cat,
    items: pendingItems.filter(item => item.categoria === cat)
  })).filter(group => group.items.length > 0);

  const getProviderPrices = (itemName: string): ProviderPrice[] => {
    return mockProviderPrices[itemName] || [
      { proveedor: 'Proveedor A', precio: 100, cantidad: 1, unidad: 'Unidad', tiempoEntrega: '2-3 días', calificacion: 4 },
      { proveedor: 'Proveedor B', precio: 95, cantidad: 1, unidad: 'Unidad', tiempoEntrega: '3-5 días', calificacion: 3 },
      { proveedor: 'Proveedor C', precio: 110, cantidad: 1, unidad: 'Unidad', tiempoEntrega: '24 hrs', calificacion: 5 },
      { proveedor: 'Proveedor D', precio: 105, cantidad: 1, unidad: 'Unidad', tiempoEntrega: '48 hrs', calificacion: 4 },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Lista de Compras</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona los artículos que necesitas comprar
          </p>
        </div>
        <div className="flex gap-2">
          {completedItems.length > 0 && (
            <Button variant="outline" onClick={clearCompleted}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Completados
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Artículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Artículo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Artículo</Label>
                  <Input id="nombre" name="nombre" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input id="cantidad" name="cantidad" type="number" min="1" defaultValue={1} required />
                  </div>
                  <div>
                    <Label htmlFor="unidad">Unidad</Label>
                    <select 
                      id="unidad" 
                      name="unidad" 
                      required 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {unidades.map(unidad => (
                        <option key={unidad} value={unidad}>{unidad}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <select 
                    id="categoria" 
                    name="categoria" 
                    required 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                <div>
                  <Label htmlFor="notas">Notas (opcional)</Label>
                  <Input id="notas" name="notas" placeholder="Ej: marca específica, talla, etc." />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Agregar a la Lista
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Artículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-orange-600">
              {pendingItems.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Prioridad Alta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              {highPriorityItems.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {completedItems.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping List by Category */}
      <div className="space-y-4">
        {highPriorityItems.length > 0 && (
          <Card className="border-red-300 border-2">
            <CardHeader>
              <CardTitle className="text-red-600">⚠️ Prioridad Alta - Comprar Pronto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {highPriorityItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <Checkbox
                    checked={item.completado}
                    onCheckedChange={() => toggleComplete(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.completado ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {item.nombre}
                      </span>
                      <Badge className={getPriorityColor(item.prioridad)}>
                        {item.prioridad}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.cantidad} {item.unidad} • {item.categoria}
                    </p>
                    {item.notas && (
                      <p className="text-sm text-gray-500 mt-1">{item.notas}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCompareDialog(item)}
                      className="text-blue-600"
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Comparar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {itemsByCategory.map(group => (
          <Card key={group.categoria}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{group.categoria}</CardTitle>
                <Badge>{group.items.length} artículos</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.items.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <Checkbox
                    checked={item.completado}
                    onCheckedChange={() => toggleComplete(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.completado ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {item.nombre}
                      </span>
                      <Badge className={getPriorityColor(item.prioridad)}>
                        {item.prioridad}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.cantidad} {item.unidad}
                    </p>
                    {item.notas && (
                      <p className="text-sm text-gray-500 mt-1">{item.notas}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCompareDialog(item)}
                      className="text-blue-600"
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Comparar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {completedItems.length > 0 && (
          <Card className="border-green-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Completados
                </CardTitle>
                <Badge variant="outline">{completedItems.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg opacity-60">
                  <Checkbox
                    checked={item.completado}
                    onCheckedChange={() => toggleComplete(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-medium line-through text-gray-600">
                      {item.nombre}
                    </span>
                    <p className="text-sm text-gray-500">
                      {item.cantidad} {item.unidad} • {item.categoria}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tu lista de compras está vacía</p>
            <p className="text-sm text-gray-400 mt-1">Agrega artículos para comenzar</p>
          </CardContent>
        </Card>
      )}

      {/* Price Comparison Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comparar Precios - {selectedItem?.nombre}</DialogTitle>
            <p className="text-sm text-gray-600">
              Cantidad solicitada: {selectedItem?.cantidad} {selectedItem?.unidad}
            </p>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border">Proveedor</th>
                      <th className="text-left p-3 border">Precio Unitario</th>
                      <th className="text-left p-3 border">Presentación</th>
                      <th className="text-left p-3 border">Total</th>
                      <th className="text-left p-3 border">Entrega</th>
                      <th className="text-left p-3 border">Calificación</th>
                      <th className="text-left p-3 border">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getProviderPrices(selectedItem.nombre)
                      .sort((a, b) => a.precio - b.precio)
                      .map((provider, idx) => {
                        const total = provider.precio * (selectedItem.cantidad || 1);
                        const isBestPrice = idx === 0;
                        
                        return (
                          <tr key={idx} className={isBestPrice ? 'bg-green-50' : ''}>
                            <td className="p-3 border">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{provider.proveedor}</span>
                                {isBestPrice && (
                                  <Badge className="bg-green-600">Mejor Precio</Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3 border">
                              <span className="font-semibold text-green-600">
                                ${provider.precio.toLocaleString()}
                              </span>
                            </td>
                            <td className="p-3 border text-sm text-gray-600">
                              {provider.unidad}
                            </td>
                            <td className="p-3 border">
                              <span className="font-semibold">
                                ${total.toLocaleString()}
                              </span>
                            </td>
                            <td className="p-3 border text-sm">
                              {provider.tiempoEntrega}
                            </td>
                            <td className="p-3 border">
                              <div className="flex items-center gap-1">
                                {'⭐'.repeat(provider.calificacion)}
                                <span className="text-sm text-gray-600">
                                  ({provider.calificacion})
                                </span>
                              </div>
                            </td>
                            <td className="p-3 border">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <DollarSign className="h-4 w-4 mr-1" />
                                Seleccionar
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Recomendación</h3>
                  <p className="text-sm text-blue-800">
                    El mejor precio es de <strong>{getProviderPrices(selectedItem.nombre)[0]?.proveedor}</strong> con
                    ${getProviderPrices(selectedItem.nombre)[0]?.precio.toLocaleString()} por unidad.
                    Ahorro estimado vs. precio más alto: ${(
                      (getProviderPrices(selectedItem.nombre)[getProviderPrices(selectedItem.nombre).length - 1]?.precio - 
                      getProviderPrices(selectedItem.nombre)[0]?.precio) * 
                      (selectedItem.cantidad || 1)
                    ).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
