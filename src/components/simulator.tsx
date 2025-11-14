"use client";

import { useState } from "react";
import { Controls } from "@/components/controlls";
import { SolarSystemChart } from "@/components/chart";
import { calculateSolarSystem, type SolarSystemConfig, type SolarSystemResult } from "@/lib/functions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export function SolarSimulator() {
  // Estado para la configuración del sistema
  const [config, setConfig] = useState<SolarSystemConfig>({
    panelKw: 0.55,
    monthlySavePerKwh: 926,
    costPerInstallation: 2100000,
    hsp: 3.9,
    areaPerPanel: 2,
  });

  // Estado para el consumo mensual
  const [monthlyConsumption, setMonthlyConsumption] = useState<number>(0);

  // Estado para los resultados de la simulación
  const [result, setResult] = useState<SolarSystemResult | null>(null);

  // Manejar cambio en la configuración
  const handleConfigChange = (newConfig: SolarSystemConfig) => {
    setConfig(newConfig);
    // Recalcular si hay un consumo mensual válido
    if (monthlyConsumption > 0) {
      const newResult = calculateSolarSystem(monthlyConsumption, newConfig);
      setResult(newResult);
    }
  };

  // Manejar cambio en el consumo mensual
  const handleConsumptionChange = (value: string) => {
    const consumption = parseFloat(value) || 0;
    setMonthlyConsumption(consumption);
    
    // Calcular resultados si el consumo es válido
    if (consumption > 0) {
      const newResult = calculateSolarSystem(consumption, config);
      setResult(newResult);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Simulador de Paneles Solares
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Calcula el sistema solar ideal para tu consumo energético, 
          el costo de instalación y el tiempo de recuperación de la inversión
        </p>
      </div>

      {/* Input de consumo mensual */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Consumo Energético
          </CardTitle>
          <CardDescription>
            Ingresa tu promedio de consumo energético mensual para calcular el sistema solar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-2">
            <Label htmlFor="monthlyConsumption" className="text-base">
              Consumo Mensual (kWh)
            </Label>
            <div className="relative">
              <Input
                id="monthlyConsumption"
                type="number"
                step="1"
                min="0"
                value={monthlyConsumption || ""}
                onChange={(e) => handleConsumptionChange(e.target.value)}
                placeholder="Ejemplo: 300"
                className="text-lg h-12 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                kWh
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Este valor generalmente aparece en tu factura de electricidad
            </p>
            
            {monthlyConsumption > 0 && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  ✓ Consumo mensual: {monthlyConsumption} kWh
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Consumo diario aproximado: {(monthlyConsumption / 30).toFixed(2)} kWh/día
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid de controles y resultados */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Controles - 1/3 del ancho */}
        <div className="lg:col-span-1">
          <Controls config={config} onConfigChange={handleConfigChange} />
        </div>

        {/* Gráficos - 2/3 del ancho */}
        <div className="lg:col-span-2">
          <SolarSystemChart 
            result={result} 
            monthlyConsumption={monthlyConsumption} 
          />
        </div>
      </div>

      {/* Footer con información adicional */}
      {result && (
        <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Resumen Ejecutivo</CardTitle>
            <CardDescription>
              Análisis completo de tu sistema solar fotovoltaico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sistema Requerido</p>
                <p className="text-2xl font-bold">
                  {result.systemPower.toFixed(2)} kW
                </p>
                <p className="text-sm text-muted-foreground">
                  con {result.numberOfPanels} paneles
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Inversión Total</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(result.totalCost)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(config.costPerInstallation)} por panel
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ahorro Estimado</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(result.annualSavings)}
                </p>
                <p className="text-sm text-muted-foreground">al año</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Retorno de Inversión</p>
                <p className="text-2xl font-bold">
                  {result.returnOnInvestment.toFixed(1)} años
                </p>
                <p className="text-sm text-muted-foreground">
                  {(result.returnOnInvestment * 12).toFixed(0)} meses
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Espacio Requerido</p>
                <p className="text-2xl font-bold">{result.requiredArea} m²</p>
                <p className="text-sm text-muted-foreground">
                  {config.areaPerPanel} m² por panel
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ahorro Mensual</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(result.monthlySavings)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {config.monthlySavePerKwh} COP/kWh
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-background/50 rounded-lg border">
              <p className="text-sm font-medium mb-2">💡 Información Adicional</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Tu consumo diario es de{" "}
                  <span className="font-medium text-foreground">
                    {result.dailyConsumption.toFixed(2)} kWh
                  </span>
                </li>
                <li>
                  • Cada panel genera aproximadamente{" "}
                  <span className="font-medium text-foreground">
                    {config.panelKw} kW
                  </span>
                  {" "}en condiciones óptimas
                </li>
                <li>
                  • La Hora Solar Pico (HSP) para tu ubicación es{" "}
                  <span className="font-medium text-foreground">
                    {config.hsp} horas
                  </span>
                </li>
                <li>
                  • Después de {result.returnOnInvestment.toFixed(1)} años, 
                  todo el ahorro será ganancia neta
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer informativo */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>
          Este simulador utiliza valores estándar de la industria solar. 
          Los resultados son estimaciones y pueden variar según condiciones específicas.
        </p>
        <p className="mt-2">
          Para una cotización precisa, consulta con un instalador profesional certificado.
        </p>
      </div>
    </div>
  );
}

