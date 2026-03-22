import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Phone, Mail, MapPin, Globe, Search, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Provider {
  id: number;
  nombre: string;
  tipo: string;
  telefono: string;
  email: string;
  direccion: string;
  sitioWeb?: string;
  notas?: string;
  calificacion: number;
  favorito: boolean;
}

const tiposProveedor = [
  'Material Dental',
  'Laboratorio',
  'Equipamiento',
  'Limpieza',
  'Mantenimiento',
  'Servicios Públicos',
  'Marketing',
  'Contabilidad',
  'Legal',
  'Otros'
];

const mockProviders: Provider[] = [
  {
    id: 1,
    nombre: 'Dental Supply Pro',
    tipo: 'Material Dental',
    telefono: '555-0201',
    email: 'ventas@dentalsupply.com',
    direccion: 'Av. Principal 123, Col. Centro',
    sitioWeb: 'www.dentalsupply.com',
    notas: 'Descuento del 15% en pedidos mayores a $10,000. Contacto directo: Juan Pérez',
    calificacion: 5,
    favorito: true
  },
  {
    id: 2,
    nombre: 'Laboratorio Dental Express',
    tipo: 'Laboratorio',
    telefono: '555-0202',
    email: 'lab@dentalexpress.com',
    direccion: 'Calle Reforma 456, Zona Industrial',
    sitioWeb: 'www.dentalexpress.com',
    notas: 'Entrega en 48 horas. Especialistas en coronas y prótesis',
    calificacion: 4,
    favorito: true
  },
  {
    id: 3,
    nombre: 'Equipo Dental S.A.',
    tipo: 'Equipamiento',
    telefono: '555-0203',
    email: 'contacto@equipodental.com',
    direccion: 'Blvd. Tecnológico 789',
    notas: 'Mantenimiento incluido primer año',
    calificacion: 4,
    favorito: false
  },
  {
    id: 4,
    nombre: 'Clean Pro Services',
    tipo: 'Limpieza',
    telefono: '555-0204',
    email: 'servicios@cleanpro.com',
    direccion: 'Col. Empresarial',
    notas: 'Servicio 3 veces por semana. Martes, Jueves y Sábado',
    calificacion: 5,
    favorito: false
  },
  {
    id: 5,
    nombre: 'Marketing Dental MX',
    tipo: 'Marketing',
    telefono: '555-0205',
    email: 'hola@marketingdental.mx',
    direccion: 'Trabajo remoto',
    sitioWeb: 'www.marketingdental.mx',
    notas: 'Especialistas en redes sociales para consultorios',
    calificacion: 4,
    favorito: true
  },
];

export function Directory() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');

  const handleAddProvider = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingProvider) {
      setProviders(providers.map(prov => 
        prov.id === editingProvider.id 
          ? {
              ...prov,
              nombre: formData.get('nombre') as string,
              tipo: formData.get('tipo') as string,
              telefono: formData.get('telefono') as string,
              email: formData.get('email') as string,
              direccion: formData.get('direccion') as string,
              sitioWeb: formData.get('sitioWeb') as string || undefined,
              notas: formData.get('notas') as string || undefined,
            }
          : prov
      ));
      toast.success('Proveedor actualizado');
    } else {
      const newProvider: Provider = {
        id: providers.length + 1,
        nombre: formData.get('nombre') as string,
        tipo: formData.get('tipo') as string,
        telefono: formData.get('telefono') as string,
        email: formData.get('email') as string,
        direccion: formData.get('direccion') as string,
        sitioWeb: formData.get('sitioWeb') as string || undefined,
        notas: formData.get('notas') as string || undefined,
        calificacion: 3,
        favorito: false,
      };
      setProviders([...providers, newProvider]);
      toast.success('Proveedor agregado exitosamente');
    }
    
    setDialogOpen(false);
    setEditingProvider(null);
  };

  const toggleFavorite = (id: number) => {
    setProviders(providers.map(prov => 
      prov.id === id ? { ...prov, favorito: !prov.favorito } : prov
    ));
  };

  const updateRating = (id: number, rating: number) => {
    setProviders(providers.map(prov => 
      prov.id === id ? { ...prov, calificacion: rating } : prov
    ));
    toast.success('Calificación actualizada');
  };

  const openEditDialog = (provider: Provider) => {
    setEditingProvider(provider);
    setDialogOpen(true);
  };

  const filteredProviders = providers
    .filter(prov => {
      const matchesSearch = prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prov.tipo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'todos' || prov.tipo === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;
      return b.calificacion - a.calificacion;
    });

  const favoriteProviders = providers.filter(p => p.favorito);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Directorio</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona proveedores y servicios
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingProvider(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProvider} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input 
                  id="nombre" 
                  name="nombre" 
                  required 
                  defaultValue={editingProvider?.nombre}
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Servicio</Label>
                <select 
                  id="tipo" 
                  name="tipo" 
                  required 
                  defaultValue={editingProvider?.tipo}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tiposProveedor.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input 
                    id="telefono" 
                    name="telefono" 
                    type="tel" 
                    required
                    defaultValue={editingProvider?.telefono}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required
                    defaultValue={editingProvider?.email}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input 
                  id="direccion" 
                  name="direccion" 
                  required
                  defaultValue={editingProvider?.direccion}
                />
              </div>
              <div>
                <Label htmlFor="sitioWeb">Sitio Web (opcional)</Label>
                <Input 
                  id="sitioWeb" 
                  name="sitioWeb" 
                  type="url"
                  defaultValue={editingProvider?.sitioWeb}
                />
              </div>
              <div>
                <Label htmlFor="notas">Notas (opcional)</Label>
                <Textarea 
                  id="notas" 
                  name="notas"
                  defaultValue={editingProvider?.notas}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingProvider ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
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
              Total Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{providers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-yellow-600">
              {favoriteProviders.length}
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
              {new Set(providers.map(p => p.tipo)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar proveedores..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los tipos</option>
                  {tiposProveedor.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Providers List */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProviders.map(provider => (
              <Card key={provider.id} className={provider.favorito ? 'border-yellow-400 border-2' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{provider.nombre}</CardTitle>
                        {provider.favorito && (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <Badge variant="outline">{provider.tipo}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(provider.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Star className={`h-5 w-5 ${provider.favorito ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${provider.telefono}`} className="hover:text-blue-600">
                        {provider.telefono}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${provider.email}`} className="hover:text-blue-600">
                        {provider.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{provider.direccion}</span>
                    </div>
                    {provider.sitioWeb && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a 
                          href={`https://${provider.sitioWeb}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          {provider.sitioWeb}
                        </a>
                      </div>
                    )}
                  </div>

                  {provider.notas && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">{provider.notas}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => updateRating(provider.id, star)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              star <= provider.calificacion 
                                ? 'fill-yellow-500 text-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(provider)}
                    >
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favoritos" className="space-y-4">
          {favoriteProviders.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tienes proveedores favoritos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {favoriteProviders.map(provider => (
                <Card key={provider.id} className="border-yellow-400 border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{provider.nombre}</CardTitle>
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </div>
                        <Badge variant="outline">{provider.tipo}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(provider.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${provider.telefono}`} className="hover:text-blue-600">
                          {provider.telefono}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${provider.email}`} className="hover:text-blue-600">
                          {provider.email}
                        </a>
                      </div>
                    </div>

                    {provider.notas && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-600">{provider.notas}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= provider.calificacion 
                                ? 'fill-yellow-500 text-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(provider)}
                      >
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
