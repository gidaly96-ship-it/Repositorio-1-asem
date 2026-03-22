import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  categoria: string;
  fecha: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, tipo: 'ingreso', concepto: 'Consulta - María García', monto: 1200, categoria: 'Consulta', fecha: '2026-02-08' },
  { id: 2, tipo: 'ingreso', concepto: 'Limpieza - Juan Pérez', monto: 800, categoria: 'Limpieza', fecha: '2026-02-08' },
  { id: 3, tipo: 'egreso', concepto: 'Material dental', monto: 3500, categoria: 'Material', fecha: '2026-02-07' },
  { id: 4, tipo: 'egreso', concepto: 'Pago de renta', monto: 8000, categoria: 'Renta', fecha: '2026-02-05' },
  { id: 5, tipo: 'ingreso', concepto: 'Ortodoncia - Ana Martínez', monto: 5000, categoria: 'Ortodoncia', fecha: '2026-02-05' },
  { id: 6, tipo: 'egreso', concepto: 'Servicios públicos', monto: 1200, categoria: 'Servicios', fecha: '2026-02-03' },
  { id: 7, tipo: 'ingreso', concepto: 'Endodoncia - Carlos López', monto: 3500, categoria: 'Endodoncia', fecha: '2026-02-02' },
];

const weeklyData = [
  { semana: 'Sem 1', ingresos: 15000, egresos: 6000 },
  { semana: 'Sem 2', ingresos: 18000, egresos: 7500 },
  { semana: 'Sem 3', ingresos: 16500, egresos: 5500 },
  { semana: 'Sem 4', ingresos: 20000, egresos: 8000 },
];

export function Finances() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalIngresos = transactions.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
  const totalEgresos = transactions.filter(t => t.tipo === 'egreso').reduce((sum, t) => sum + t.monto, 0);
  const balance = totalIngresos - totalEgresos;

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      tipo: formData.get('tipo') as 'ingreso' | 'egreso',
      concepto: formData.get('concepto') as string,
      monto: parseFloat(formData.get('monto') as string),
      categoria: formData.get('categoria') as string,
      fecha: formData.get('fecha') as string,
    };

    setTransactions([newTransaction, ...transactions]);
    setDialogOpen(false);
    toast.success('Transacción registrada exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Finanzas</h2>
          <p className="mt-1 text-sm text-gray-600">
            Controla tus ingresos y egresos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Transacción
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Transacción</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select name="tipo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="concepto">Concepto</Label>
                <Input id="concepto" name="concepto" required />
              </div>
              <div>
                <Label htmlFor="monto">Monto ($)</Label>
                <Input id="monto" name="monto" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Input id="categoria" name="categoria" required />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" name="fecha" type="date" required />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Registrar Transacción
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
              Total Ingresos
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              ${totalIngresos.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Egresos
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              ${totalEgresos.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Balance
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Egresos (Semanal)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
              <Bar dataKey="egresos" fill="#ef4444" name="Egresos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="egresos">Egresos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="todas" className="space-y-3 mt-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${transaction.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.tipo === 'ingreso' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.concepto}</p>
                      <p className="text-sm text-gray-500">{transaction.categoria} • {new Date(transaction.fecha).toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.tipo === 'ingreso' ? '+' : '-'}${transaction.monto.toLocaleString()}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="ingresos" className="space-y-3 mt-4">
              {transactions.filter(t => t.tipo === 'ingreso').map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-green-100">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.concepto}</p>
                      <p className="text-sm text-gray-500">{transaction.categoria} • {new Date(transaction.fecha).toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    +${transaction.monto.toLocaleString()}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="egresos" className="space-y-3 mt-4">
              {transactions.filter(t => t.tipo === 'egreso').map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-100">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.concepto}</p>
                      <p className="text-sm text-gray-500">{transaction.categoria} • {new Date(transaction.fecha).toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    -${transaction.monto.toLocaleString()}
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
