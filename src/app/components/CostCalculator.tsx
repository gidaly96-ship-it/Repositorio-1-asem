import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calculator, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export function CostCalculator() {
  // Chair Cost Calculator State
  const [rentaMensual, setRentaMensual] = useState(8000);
  const [servicios, setServicios] = useState(1500);
  const [salarios, setSalarios] = useState(12000);
  const [mantenimiento, setMantenimiento] = useState(2000);
  const [seguros, setSeguros] = useState(1000);
  const [impuestos, setImpuestos] = useState(3000);
  const [otrosGastos, setOtrosGastos] = useState(1500);
  const [diasMes, setDiasMes] = useState(22);
  const [horasDia, setHorasDia] = useState(8);

  // Treatment Cost Calculator State
  const [nombreTratamiento, setNombreTratamiento] = useState('Endodoncia');
  const [costoMateriales, setCostoMateriales] = useState(1200);
  const [tiempoTratamiento, setTiempoTratamiento] = useState(90);
  const [margenGanancia, setMargenGanancia] = useState(40);

  // Chair Cost Calculations
  const gastosFixosMensuales = rentaMensual + servicios + salarios + mantenimiento + seguros + impuestos + otrosGastos;
  const horasMensuales = diasMes * horasDia;
  const costoPorHora = gastosFixosMensuales / horasMensuales;
  const costoPorMinuto = costoPorHora / 60;

  // Treatment Cost Calculations
  const costoTiempo = (tiempoTratamiento / 60) * costoPorHora;
  const costoTotal = costoMateriales + costoTiempo;
  const margenMonto = costoTotal * (margenGanancia / 100);
  const precioSugerido = costoTotal + margenMonto;

  // Tax calculations
  const iva = precioSugerido * 0.16;
  const precioConIva = precioSugerido + iva;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Calculadora de Costos</h2>
        <p className="mt-1 text-sm text-gray-600">
          Calcula el costo por hora de sillón y precio de tratamientos
        </p>
      </div>

      <Tabs defaultValue="sillon">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sillon">Costo por Hora de Sillón</TabsTrigger>
          <TabsTrigger value="tratamiento">Costo por Tratamiento</TabsTrigger>
        </TabsList>

        {/* Chair Hour Cost Calculator */}
        <TabsContent value="sillon" className="space-y-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Gastos Fijos Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="renta">Renta del Local ($)</Label>
                  <Input
                    id="renta"
                    type="number"
                    value={rentaMensual}
                    onChange={(e) => setRentaMensual(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="servicios">Servicios Públicos ($)</Label>
                  <Input
                    id="servicios"
                    type="number"
                    value={servicios}
                    onChange={(e) => setServicios(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Luz, agua, internet, teléfono</p>
                </div>
                <div>
                  <Label htmlFor="salarios">Salarios y Nómina ($)</Label>
                  <Input
                    id="salarios"
                    type="number"
                    value={salarios}
                    onChange={(e) => setSalarios(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Asistentes, recepcionista, limpieza</p>
                </div>
                <div>
                  <Label htmlFor="mantenimiento">Mantenimiento y Equipo ($)</Label>
                  <Input
                    id="mantenimiento"
                    type="number"
                    value={mantenimiento}
                    onChange={(e) => setMantenimiento(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Calibración, reparaciones</p>
                </div>
                <div>
                  <Label htmlFor="seguros">Seguros ($)</Label>
                  <Input
                    id="seguros"
                    type="number"
                    value={seguros}
                    onChange={(e) => setSeguros(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Seguro del local, responsabilidad civil</p>
                </div>
                <div>
                  <Label htmlFor="impuestos">Impuestos y Permisos ($)</Label>
                  <Input
                    id="impuestos"
                    type="number"
                    value={impuestos}
                    onChange={(e) => setImpuestos(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Licencias, COFEPRIS, SAT</p>
                </div>
                <div>
                  <Label htmlFor="otros">Otros Gastos ($)</Label>
                  <Input
                    id="otros"
                    type="number"
                    value={otrosGastos}
                    onChange={(e) => setOtrosGastos(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Marketing, papelería, imprevistos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Horario de Trabajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dias">Días Laborales por Mes</Label>
                  <Input
                    id="dias"
                    type="number"
                    value={diasMes}
                    onChange={(e) => setDiasMes(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Usualmente 20-24 días</p>
                </div>
                <div>
                  <Label htmlFor="horas">Horas de Trabajo por Día</Label>
                  <Input
                    id="horas"
                    type="number"
                    value={horasDia}
                    onChange={(e) => setHorasDia(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tiempo efectivo de atención</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
              <CardHeader>
                <CardTitle className="text-lg">Gastos Totales Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">
                  ${gastosFixosMensuales.toLocaleString()}
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {horasMensuales} horas mensuales
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
              <CardHeader>
                <CardTitle className="text-lg">Costo por Hora de Sillón</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  ${costoPorHora.toFixed(2)}
                </div>
                <p className="text-sm text-green-700 mt-1">
                  ${costoPorMinuto.toFixed(2)} por minuto
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">💡 Recomendaciones</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Este costo debe ser la base para calcular el precio de TODOS tus tratamientos</li>
                    <li>• Considera que no todas las horas son productivas (cancelaciones, tiempo muerto)</li>
                    <li>• Revisa estos cálculos cada 3-6 meses para ajustar precios</li>
                    <li>• Usa este costo para evaluar qué tratamientos son más rentables</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Desglose de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { concepto: 'Renta del Local', monto: rentaMensual },
                  { concepto: 'Servicios Públicos', monto: servicios },
                  { concepto: 'Salarios y Nómina', monto: salarios },
                  { concepto: 'Mantenimiento y Equipo', monto: mantenimiento },
                  { concepto: 'Seguros', monto: seguros },
                  { concepto: 'Impuestos y Permisos', monto: impuestos },
                  { concepto: 'Otros Gastos', monto: otrosGastos },
                ].map((item, idx) => {
                  const porcentaje = (item.monto / gastosFixosMensuales) * 100;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{item.concepto}</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          ${item.monto.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {porcentaje.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatment Cost Calculator */}
        <TabsContent value="tratamiento" className="space-y-6">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Información del Tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tratamiento">Nombre del Tratamiento</Label>
                <Input
                  id="tratamiento"
                  value={nombreTratamiento}
                  onChange={(e) => setNombreTratamiento(e.target.value)}
                  placeholder="Ej: Endodoncia, Corona, Limpieza"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="materiales">Costo de Materiales ($)</Label>
                  <Input
                    id="materiales"
                    type="number"
                    value={costoMateriales}
                    onChange={(e) => setCostoMateriales(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Anestesia, fresas, materiales de impresión, etc.
                  </p>
                </div>
                <div>
                  <Label htmlFor="tiempo">Tiempo del Tratamiento (minutos)</Label>
                  <Input
                    id="tiempo"
                    type="number"
                    value={tiempoTratamiento}
                    onChange={(e) => setTiempoTratamiento(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Incluye preparación y limpieza
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="margen">Margen de Ganancia Deseado (%)</Label>
                <Input
                  id="margen"
                  type="number"
                  value={margenGanancia}
                  onChange={(e) => setMargenGanancia(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: 30-50% dependiendo del tratamiento
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Desglose de Costos - {nombreTratamiento}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Materiales</span>
                  <span className="font-semibold text-blue-900">
                    ${costoMateriales.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium block">Tiempo de Sillón</span>
                    <span className="text-xs text-gray-600">
                      {tiempoTratamiento} min × ${costoPorMinuto.toFixed(2)}/min
                    </span>
                  </div>
                  <span className="font-semibold text-green-900">
                    ${costoTiempo.toFixed(2)}
                  </span>
                </div>
                <div className="border-t-2 pt-3">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Costo Total</span>
                    <span>${costoTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">
                    Margen de Ganancia ({margenGanancia}%)
                  </span>
                  <span className="font-semibold text-purple-900">
                    +${margenMonto.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Price */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
              <CardHeader>
                <CardTitle className="text-lg">Precio Sugerido (sin IVA)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">
                  ${precioSugerido.toFixed(2)}
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Base para facturación
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
              <CardHeader>
                <CardTitle className="text-lg">Precio con IVA (16%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">
                  ${precioConIva.toFixed(2)}
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  IVA: ${iva.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">💡 Análisis del Tratamiento</h3>
                  <div className="text-sm text-yellow-800 space-y-2">
                    <p><strong>Rentabilidad:</strong> Este tratamiento genera ${margenMonto.toFixed(2)} de ganancia neta</p>
                    <p><strong>Punto de Equilibrio:</strong> Necesitas realizar {Math.ceil(gastosFixosMensuales / margenMonto)} tratamientos de este tipo al mes para cubrir gastos fijos</p>
                    <p><strong>Tiempo vs Ganancia:</strong> Estás ganando ${((margenMonto / tiempoTratamiento) * 60).toFixed(2)} por hora con este tratamiento</p>
                    {((margenMonto / tiempoTratamiento) * 60) < costoPorHora && (
                      <p className="text-red-700 font-semibold">⚠️ Advertencia: Este tratamiento genera menos ganancia por hora que tu costo de sillón. Considera aumentar el precio.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Escenarios Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNombreTratamiento('Limpieza Dental');
                    setCostoMateriales(150);
                    setTiempoTratamiento(45);
                    setMargenGanancia(35);
                  }}
                >
                  Limpieza Dental
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNombreTratamiento('Endodoncia');
                    setCostoMateriales(1200);
                    setTiempoTratamiento(90);
                    setMargenGanancia(40);
                  }}
                >
                  Endodoncia
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNombreTratamiento('Corona Dental');
                    setCostoMateriales(2500);
                    setTiempoTratamiento(120);
                    setMargenGanancia(45);
                  }}
                >
                  Corona Dental
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
