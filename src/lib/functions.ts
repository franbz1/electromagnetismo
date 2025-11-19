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
  // Validar que los valores críticos no sean cero o inválidos
  const safeHsp = config.hsp > 0 ? config.hsp : 1;
  const safePanelKw = config.panelKw > 0 ? config.panelKw : 0.55;
  const safeMonthlySavePerKwh = config.monthlySavePerKwh >= 0 ? config.monthlySavePerKwh : 0;
  const safeCostPerInstallation = config.costPerInstallation >= 0 ? config.costPerInstallation : 0;
  const safeAreaPerPanel = config.areaPerPanel > 0 ? config.areaPerPanel : 2;
  
  // Consumo diario = Consumo mensual / 30
  const dailyConsumption = monthlyConsumption / 30;
  
  // Potencia necesaria (kW) = Consumo diario (kWh/día) / HSP
  const systemPower = dailyConsumption / safeHsp;
  
  // Número de paneles = Potencia necesaria (kW) / panelKw
  const numberOfPanels = Math.ceil(systemPower / safePanelKw);
  
  // Ahorro mensual = Consumo mensual (kWh) × monthlySavePerKwh COP
  const monthlySavings = monthlyConsumption * safeMonthlySavePerKwh;
  
  // Ahorro anual = Ahorro mensual × 12
  const annualSavings = monthlySavings * 12;
  
  // Costo total = Número de paneles × costPerInstallation COP
  const totalCost = numberOfPanels * safeCostPerInstallation;
  
  // Retorno (años) = Costo total / Ahorro anual
  // Validar división por cero
  const returnOnInvestment = annualSavings > 0 ? totalCost / annualSavings : 0;
  
  // Área (m²) = Número de paneles × areaPerPanel
  const requiredArea = numberOfPanels * safeAreaPerPanel;
  
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