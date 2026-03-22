import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, AlertTriangle, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface Debt {
  id: number;
  acreedor: string;
  concepto: string;
  montoTotal: number;
  montoPagado: number;
  fechaVencimiento: string;
  estado: 'vigente' | 'vencida' | 'pagada';
  tasaInteres?: number;
}

const mockDebts: Debt[] = [
  { 
    id: 1, 
    acreedor: 'Proveedor Dental ABC', 
    concepto: 'Equipo de esterilización', 
    montoTotal: 85000, 
    montoPagado: 45000, 
    fechaVencimiento: '2026-03-15', 
    estado: 'vigente',
    tasaInteres: 12
  },
  { 
    id: 2, 
    acreedor: 'Banco Nacional', 
    concepto: 'Préstamo para remodelación', 
    montoTotal: 150000, 
    montoPagado: 60000, 
    fechaVencimiento: '2026-06-30', 
    estado: 'vigente',
    tasaInteres: 15
  },
  { 
    id: 3, 
    acreedor: 'Distribuidora XYZ', 
    concepto: 'Material dental', 
    montoTotal: 12000, 
    montoPagado: 0, 
    fechaVencimiento: '2026-02-05', 
    estado: 'vencida',
    tasaInteres: 10
  },
  { 
    id: 4, 
    acreedor: 'Laboratorio Dental Pro', 
    concepto: 'Prótesis y coronas', 
    montoTotal: 25000, 
    montoPagado: 15000, 
    fechaVencimiento: '2026-02-28', 
    estado: 'vigente'
  },
];

export function Debts() {
  const [debts, setDebts] = useState<Debt[]>(mockDebts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  const handleAddDebt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDebt: Debt = {
      id: debts.length + 1,
      acreedor: formData.get('acreedor') as string,
      concepto: formData.get('concepto') as string,
      montoTotal: parseFloat(formData.get('montoTotal') as string),
      montoPagado: 0,
      fechaVencimiento: formData.get('fechaVencimiento') as string,
      estado: 'vigente',
      tasaInteres: parseFloat(formData.get('tasaInteres') as string) || undefined,
    };

    setDebts([...debts, newDebt]);
    setDialogOpen(false);
    toast.success('Deuda registrada exitosamente');
  };

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDebt) return;

    const formData = new FormData(e.currentTarget);
    const payment = parseFloat(formData.get('monto') as string);

    setDebts(debts.map(debt => {
      if (debt.id === selectedDebt.id) {
        const newMontoPagado = debt.montoPagado + payment;
        return {
          ...debt,
          montoPagado: newMontoPagado,
          estado: newMontoPagado >= debt.montoTotal ? 'pagada' : debt.estado,
        };
      }
      return debt;
    }));

    setPaymentDialogOpen(false);
    setSelectedDebt(null);
    toast.success('Pago registrado exitosamente');
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.montoTotal, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + debt.montoPagado, 0);
  const totalRemaining = totalDebt - totalPaid;
  const overdueDebts = debts.filter(d => d.estado === 'vencida');

  const isOverdue = (debt: Debt) => {
    return new Date(debt.fechaVencimiento) < new Date() && debt.estado !== 'pagada';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Deudas</h2>
          <p className="mt-1 text-sm text-gray-600">
            Controla tus obligaciones financieras
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Deuda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nueva Deuda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDebt} className="space-y-4">
              <div>
                <Label htmlFor="acreedor">Acreedor</Label>
                <Input id="acreedor" name="acreedor" required />
              </div>
              <div>
                <Label htmlFor="concepto">Concepto</Label>
                <Input id="concepto" name="concepto" required />
              </div>
              <div>
                <Label htmlFor="montoTotal">Monto Total ($)</Label>
                <Input id="montoTotal" name="montoTotal" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                <Input id="fechaVencimiento" name="fechaVencimiento" type="date" required />
              </div>
              <div>
                <Label htmlFor="tasaInteres">Tasa de Interés (% anual - opcional)</Label>
                <Input id="tasaInteres" name="tasaInteres" type="number" step="0.01" />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Registrar Deuda
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Deuda Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              ${totalDebt.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pagado
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              ${totalPaid.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Saldo Pendiente
            </CardTitle>
            <DollarSign className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-orange-600">
              ${totalRemaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Deudas Vencidas
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              {overdueDebts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pagado: ${totalPaid.toLocaleString()}</span>
              <span className="text-gray-600">Total: ${totalDebt.toLocaleString()}</span>
            </div>
            <Progress value={(totalPaid / totalDebt) * 100} className="h-3" />
            <p className="text-sm text-center text-gray-600">
              {((totalPaid / totalDebt) * 100).toFixed(1)}% pagado
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Debts List */}
      <div className="grid gap-4">
        {debts.map((debt) => {
          const percentage = (debt.montoPagado / debt.montoTotal) * 100;
          const remaining = debt.montoTotal - debt.montoPagado;
          const daysUntilDue = Math.ceil((new Date(debt.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <Card key={debt.id} className={debt.estado === 'vencida' ? 'border-red-300' : ''}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{debt.acreedor}</h3>
                        <Badge variant={
                          debt.estado === 'pagada' ? 'default' : 
                          debt.estado === 'vencida' ? 'destructive' : 
                          'secondary'
                        }>
                          {debt.estado === 'pagada' ? 'Pagada' : 
                           debt.estado === 'vencida' ? 'Vencida' : 
                           'Vigente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{debt.concepto}</p>
                      {debt.tasaInteres && (
                        <p className="text-sm text-gray-500 mt-1">
                          Tasa de interés: {debt.tasaInteres}% anual
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${debt.montoTotal.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Monto total</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Pagado: ${debt.montoPagado.toLocaleString()}
                      </span>
                      <span className="text-gray-600">
                        Restante: ${remaining.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Vence: {new Date(debt.fechaVencimiento).toLocaleDateString('es-MX')}
                      </span>
                      {debt.estado !== 'pagada' && (
                        <span className={`${
                          daysUntilDue < 0 ? 'text-red-600' :
                          daysUntilDue <= 7 ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {daysUntilDue < 0 
                            ? `Vencida hace ${Math.abs(daysUntilDue)} días`
                            : daysUntilDue === 0
                            ? 'Vence hoy'
                            : `${daysUntilDue} días restantes`
                          }
                        </span>
                      )}
                    </div>
                    {debt.estado !== 'pagada' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setSelectedDebt(debt);
                          setPaymentDialogOpen(true);
                        }}
                      >
                        Registrar Pago
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>
          {selectedDebt && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Deuda seleccionada:</p>
                <p className="font-semibold text-gray-900">{selectedDebt.acreedor}</p>
                <p className="text-sm text-gray-600">
                  Saldo pendiente: ${(selectedDebt.montoTotal - selectedDebt.montoPagado).toLocaleString()}
                </p>
              </div>
              <div>
                <Label htmlFor="monto">Monto a Pagar ($)</Label>
                <Input 
                  id="monto" 
                  name="monto" 
                  type="number" 
                  step="0.01" 
                  max={selectedDebt.montoTotal - selectedDebt.montoPagado}
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Confirmar Pago
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}