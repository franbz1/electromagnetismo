export interface SolarSystemConfig {
  panelKw: number; // Panel power in kW (e.g., 0.55 for 550W)
  monthlySavePerKwh: number; // COP per kWh
  costPerInstallation: number; // COP per panel
  hsp: number; // Hora Solar Pico
  areaPerPanel: number; // m² per panel
}

export interface SolarSystemResult {
  dailyConsumption: number; // kWh/día
  systemPower: number; // kW
  numberOfPanels: number;
  monthlySavings: number; // COP
  annualSavings: number; // COP
  totalCost: number; // COP
  returnOnInvestment: number; // years
  requiredArea: number; // m²
}

export const calculateSolarSystem = (
  monthlyConsumption: number,
  config: SolarSystemConfig
): SolarSystemResult => {
  // Consumo diario = Consumo mensual / 30
  const dailyConsumption = monthlyConsumption / 30;
  
  // Potencia necesaria (kW) = Consumo diario (kWh/día) / HSP
  const systemPower = dailyConsumption / config.hsp;
  
  // Número de paneles = Potencia necesaria (kW) / panelKw
  const numberOfPanels = Math.ceil(systemPower / config.panelKw);
  
  // Ahorro mensual = Consumo mensual (kWh) × monthlySavePerKwh COP
  const monthlySavings = monthlyConsumption * config.monthlySavePerKwh;
  
  // Ahorro anual = Ahorro mensual × 12
  const annualSavings = monthlySavings * 12;
  
  // Costo total = Número de paneles × costPerInstallation COP
  const totalCost = numberOfPanels * config.costPerInstallation;
  
  // Retorno (años) = Costo total / Ahorro anual
  const returnOnInvestment = totalCost / annualSavings;
  
  // Área (m²) = Número de paneles × areaPerPanel
  const requiredArea = numberOfPanels * config.areaPerPanel;
  
  return {
    dailyConsumption,
    systemPower,
    numberOfPanels,
    monthlySavings,
    annualSavings,
    totalCost,
    returnOnInvestment,
    requiredArea
  };
}