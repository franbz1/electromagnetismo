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
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Simulador de Paneles Solares
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
          Calcula el sistema solar ideal para tu consumo energético, 
          el costo de instalación y el tiempo de recuperación de la inversión
        </p>
      </div>

      {/* Input de consumo mensual */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            Consumo Energético
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Ingresa tu promedio de consumo energético mensual para calcular el sistema solar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-2">
            <Label htmlFor="monthlyConsumption" className="text-sm sm:text-base">
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
                className="text-base sm:text-lg h-11 sm:h-12 pr-14 sm:pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm sm:text-base">
                kWh
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Este valor generalmente aparece en tu factura de electricidad
            </p>
            
            {monthlyConsumption > 0 && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs sm:text-sm font-medium text-primary">
                  ✓ Consumo mensual: {monthlyConsumption} kWh
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Consumo diario aproximado: {(monthlyConsumption / 30).toFixed(2)} kWh/día
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid de controles y resultados */}
      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
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
            <CardTitle className="text-lg sm:text-xl">Resumen Ejecutivo</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Análisis completo de tu sistema solar fotovoltaico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Sistema Requerido</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {result.systemPower.toFixed(2)} kW
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  con {result.numberOfPanels} paneles
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Inversión Total</p>
                <p className="text-lg sm:text-2xl font-bold wrap-break-word">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(result.totalCost)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground wrap-break-word">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(config.costPerInstallation)} por panel
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Ahorro Estimado</p>
                <p className="text-lg sm:text-2xl font-bold wrap-break-word">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(result.annualSavings)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">al año</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Retorno de Inversión</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {result.returnOnInvestment.toFixed(1)} años
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {(result.returnOnInvestment * 12).toFixed(0)} meses
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Espacio Requerido</p>
                <p className="text-xl sm:text-2xl font-bold">{result.requiredArea} m²</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {config.areaPerPanel} m² por panel
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Ahorro Mensual</p>
                <p className="text-lg sm:text-2xl font-bold wrap-break-word">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(result.monthlySavings)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {config.monthlySavePerKwh} COP/kWh
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-background/50 rounded-lg border">
              <p className="text-xs sm:text-sm font-medium mb-2">💡 Información Adicional</p>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
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
      <div className="text-center text-xs sm:text-sm text-muted-foreground border-t pt-4 sm:pt-6 px-4">
        <p>
          Este simulador utiliza valores estándar de la industria solar. 
          Los resultados son estimaciones y pueden variar según condiciones específicas.
        </p>
        <p className="mt-1 sm:mt-2">
          Para una cotización precisa, consulta con un instalador profesional certificado.
        </p>
      </div>
    </div>
  );
}

