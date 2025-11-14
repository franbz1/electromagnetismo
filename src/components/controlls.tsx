import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SolarSystemConfig } from "@/lib/functions";

interface ControlsProps {
  config: SolarSystemConfig;
  onConfigChange: (config: SolarSystemConfig) => void;
}

const defaultConfig: SolarSystemConfig = {
  panelKw: 0.55,
  monthlySavePerKwh: 926,
  costPerInstallation: 2100000,
  hsp: 3.9,
  areaPerPanel: 2,
};

export function Controls({ config, onConfigChange }: ControlsProps) {
  const [localConfig, setLocalConfig] = useState<SolarSystemConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (field: keyof SolarSystemConfig, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newConfig = { ...localConfig, [field]: numValue };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleReset = () => {
    setLocalConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema Solar</CardTitle>
          <CardDescription>
            Ajusta los parámetros del sistema de paneles solares
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración del Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Configuración del Panel</h3>
              <p className="text-xs text-muted-foreground">
                Parámetros relacionados con las características del panel solar
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="panelKw">
                  Potencia del Panel (kW)
                </Label>
                <Input
                  id="panelKw"
                  type="number"
                  step="0.01"
                  min="0"
                  value={localConfig.panelKw}
                  onChange={(e) => handleChange("panelKw", e.target.value)}
                  placeholder="0.55"
                />
                <p className="text-xs text-muted-foreground">
                  Ejemplo: 0.55 kW para un panel de 550W
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaPerPanel">
                  Área por Panel (m²)
                </Label>
                <Input
                  id="areaPerPanel"
                  type="number"
                  step="0.1"
                  min="0"
                  value={localConfig.areaPerPanel}
                  onChange={(e) => handleChange("areaPerPanel", e.target.value)}
                  placeholder="2"
                />
                <p className="text-xs text-muted-foreground">
                  Área requerida por cada panel solar
                </p>
              </div>
            </div>
          </div>

          {/* Configuración Económica */}
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Configuración Económica</h3>
              <p className="text-xs text-muted-foreground">
                Parámetros relacionados con costos y ahorros
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthlySavePerKwh">
                  Ahorro Mensual por kWh (COP)
                </Label>
                <Input
                  id="monthlySavePerKwh"
                  type="number"
                  step="1"
                  min="0"
                  value={localConfig.monthlySavePerKwh}
                  onChange={(e) => handleChange("monthlySavePerKwh", e.target.value)}
                  placeholder="926"
                />
                <p className="text-xs text-muted-foreground">
                  Costo del kWh en pesos colombianos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPerInstallation">
                  Costo de Instalación por Panel (COP)
                </Label>
                <Input
                  id="costPerInstallation"
                  type="number"
                  step="1000"
                  min="0"
                  value={localConfig.costPerInstallation}
                  onChange={(e) => handleChange("costPerInstallation", e.target.value)}
                  placeholder="2100000"
                />
                <p className="text-xs text-muted-foreground">
                  Costo total de instalación por panel
                </p>
              </div>
            </div>
          </div>

          {/* Configuración Técnica */}
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Configuración Técnica</h3>
              <p className="text-xs text-muted-foreground">
                Parámetros técnicos del sistema solar
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hsp">
                  Hora Solar Pico (HSP)
                </Label>
                <Input
                  id="hsp"
                  type="number"
                  step="0.1"
                  min="0"
                  value={localConfig.hsp}
                  onChange={(e) => handleChange("hsp", e.target.value)}
                  placeholder="3.9"
                />
                <p className="text-xs text-muted-foreground">
                  Horas de sol pico diarias (ejemplo: 3.9 para Pasto)
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Reset */}
          <div className="border-t pt-4">
            <button
              onClick={handleReset}
              className="w-full cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Restablecer Valores por Defecto
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

