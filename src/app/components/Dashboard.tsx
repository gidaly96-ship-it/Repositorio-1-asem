import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

const monthlyData = [
  { id: 'ago', mes: 'Ago', ingresos: 45000, egresos: 18000 },
  { id: 'sep', mes: 'Sep', ingresos: 52000, egresos: 20000 },
  { id: 'oct', mes: 'Oct', ingresos: 48000, egresos: 19000 },
  { id: 'nov', mes: 'Nov', ingresos: 61000, egresos: 22000 },
  { id: 'dic', mes: 'Dic', ingresos: 55000, egresos: 21000 },
  { id: 'ene', mes: 'Ene', ingresos: 67000, egresos: 24000 },
];

const treatmentData = [
  { id: 'limpiezas', nombre: 'Limpiezas', valor: 35 },
  { id: 'endodoncias', nombre: 'Endodoncias', valor: 25 },
  { id: 'ortodoncias', nombre: 'Ortodoncias', valor: 20 },
  { id: 'extracciones', nombre: 'Extracciones', valor: 12 },
  { id: 'otros', nombre: 'Otros', valor: 8 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Dashboard() {
  const { getTermPlural, appName } = useApp();
  const totalIngresos = monthlyData[monthlyData.length - 1].ingresos;
  const totalEgresos = monthlyData[monthlyData.length - 1].egresos;
  const ganancia = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Resumen general de {appName}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalIngresos.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">+12.5% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Egresos del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalEgresos.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">+4.2% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ganancia Neta
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">${ganancia.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">+18.1% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {getTermPlural()} Activos
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">248</div>
            <p className="text-xs text-gray-500 mt-1">+8 nuevos este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card key="income-chart-card">
          <CardHeader>
            <CardTitle>Ingresos vs Egresos (últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key="income-chart-container">
              <LineChart data={monthlyData} id="income-expense-chart" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" key="income-grid" />
                <XAxis dataKey="mes" key="income-xaxis" />
                <YAxis key="income-yaxis" />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} key="income-tooltip" />
                <Legend key="income-legend" />
                <Line key="line-ingresos" type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                <Line key="line-egresos" type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={2} name="Egresos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card key="treatment-chart-card">
          <CardHeader>
            <CardTitle>Tratamientos Realizados (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key="treatment-chart-container">
              <PieChart id="treatments-chart" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={treatmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, valor }) => `${nombre}: ${valor}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="nombre"
                  key="treatment-pie"
                >
                  {treatmentData.map((entry, index) => (
                    <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} key="treatment-tooltip" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            Recordatorios Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              5 {getTermPlural().toLowerCase()} con pagos pendientes este mes
            </li>
            <li className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              Campaña publicitaria programada para mañana
            </li>
            <li className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              3 deudas vencen en los próximos 7 días
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}