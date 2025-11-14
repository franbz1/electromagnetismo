"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { SolarSystemResult } from "@/lib/functions";
import { DollarSign, Zap, Calendar } from "lucide-react";

interface ChartProps {
  result: SolarSystemResult | null;
  monthlyConsumption: number;
}

export function SolarSystemChart({ result, monthlyConsumption }: ChartProps) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Resultados de la Simulación</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Los resultados aparecerán aquí una vez que ingreses el consumo mensual
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center text-muted-foreground px-4">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Esperando datos de simulación...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Datos para el gráfico de barras - Comparación de métricas
  const metricsData = [
    {
      name: "Potencia",
      value: result.systemPower,
      unit: "kW",
      fill: "var(--color-power)",
    },
    {
      name: "Paneles",
      value: result.numberOfPanels,
      unit: "unidades",
      fill: "var(--color-panels)",
    },
    {
      name: "Área",
      value: result.requiredArea,
      unit: "m²",
      fill: "var(--color-area)",
    },
    {
      name: "Años ROI",
      value: Number(result.returnOnInvestment.toFixed(1)),
      unit: "años",
      fill: "var(--color-roi)",
    },
  ];

  const metricsConfig = {
    power: {
      label: "Potencia del Sistema",
      color: "oklch(0.646 0.222 41.116)",
    },
    panels: {
      label: "Número de Paneles",
      color: "oklch(0.6 0.118 184.704)",
    },
    area: {
      label: "Área Requerida",
      color: "oklch(0.769 0.188 70.08)",
    },
    roi: {
      label: "Retorno de Inversión",
      color: "oklch(0.828 0.189 84.429)",
    },
  } satisfies ChartConfig;

  // Datos para el gráfico de costos vs ahorros
  const financialData = [
    {
      category: "Inversión Inicial",
      value: result.totalCost,
      fill: "var(--color-cost)",
    },
    {
      category: "Ahorro Anual",
      value: result.annualSavings,
      fill: "var(--color-savings)",
    },
  ];

  const financialConfig = {
    cost: {
      label: "Inversión Inicial",
      color: "oklch(0.488 0.243 264.376)",
    },
    savings: {
      label: "Ahorro Anual",
      color: "oklch(0.696 0.17 162.48)",
    },
  } satisfies ChartConfig;

  // Datos para proyección de ahorro en años
  const projectionYears = Math.ceil(result.returnOnInvestment) + 3;
  const projectionData = Array.from({ length: projectionYears }, (_, i) => {
    const year = i + 1;
    const cumulativeSavings = result.annualSavings * year;
    const netSavings = cumulativeSavings - result.totalCost;
    return {
      year: `Año ${year}`,
      savings: cumulativeSavings,
      cost: result.totalCost,
      net: netSavings > 0 ? netSavings : 0,
    };
  });

  const projectionConfig = {
    savings: {
      label: "Ahorro Acumulado",
      color: "oklch(0.696 0.17 162.48)",
    },
    cost: {
      label: "Inversión Inicial",
      color: "oklch(0.488 0.243 264.376)",
    },
    net: {
      label: "Ganancia Neta",
      color: "oklch(0.769 0.188 70.08)",
    },
  } satisfies ChartConfig;

  // Datos para consumo
  const consumptionData = [
    {
      name: "Consumo Diario",
      value: Number(result.dailyConsumption.toFixed(2)),
      fill: "var(--color-daily)",
    },
    {
      name: "Consumo Mensual",
      value: monthlyConsumption,
      fill: "var(--color-monthly)",
    },
  ];

  const consumptionConfig = {
    daily: {
      label: "Consumo Diario",
      color: "oklch(0.828 0.189 84.429)",
    },
    monthly: {
      label: "Consumo Mensual",
      color: "oklch(0.645 0.246 16.439)",
    },
  } satisfies ChartConfig;

  // Función para formatear números grandes
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">Potencia del Sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1 shrink-0" />
              <div className="text-xl sm:text-2xl font-bold leading-tight">{result.systemPower.toFixed(2)} kW</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
              {result.numberOfPanels} paneles de 0.55 kW
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">Inversión Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-chart-2 shrink-0" />
              <div className="text-lg sm:text-2xl font-bold leading-tight wrap-break-word">
                {formatCurrency(result.totalCost)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
              Costo de instalación completo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">Ahorro Anual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-chart-3 shrink-0" />
              <div className="text-lg sm:text-2xl font-bold leading-tight wrap-break-word">
                {formatCurrency(result.annualSavings)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2 wrap-break-word">
              {formatCurrency(result.monthlySavings)} mensuales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">Retorno de Inversión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-chart-4 shrink-0" />
              <div className="text-xl sm:text-2xl font-bold leading-tight">
                {result.returnOnInvestment.toFixed(1)} años
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
              Área requerida: {result.requiredArea} m²
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de métricas del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Métricas del Sistema Solar</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Resumen de las características técnicas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ChartContainer config={metricsConfig} className="min-h-[250px] sm:min-h-[300px] w-full">
            <BarChart accessibilityLayer data={metricsData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, props) => (
                      <>
                        <div className="font-medium">{value}</div>
                        <div className="text-xs text-muted-foreground">
                          {props.payload.unit}
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {metricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de análisis financiero */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Análisis Financiero</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Inversión vs Ahorro Anual</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer config={financialConfig} className="min-h-[250px] sm:min-h-[300px] w-full">
              <BarChart accessibilityLayer data={financialData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) =>
                    `$${(value / 1000000).toFixed(1)}M`
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Consumo Energético</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Diario vs Mensual (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer config={consumptionConfig} className="min-h-[250px] sm:min-h-[300px] w-full">
              <BarChart accessibilityLayer data={consumptionData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${value} kWh`}
                    />
                  }
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {consumptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de proyección de ahorro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Proyección de Recuperación de Inversión</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Ahorro acumulado vs inversión inicial a lo largo de los años
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ChartContainer config={projectionConfig} className="min-h-[300px] sm:min-h-[350px] w-full">
            <LineChart accessibilityLayer data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <ChartLegend 
                content={<ChartLegendContent />}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="var(--color-savings)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="var(--color-cost)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="var(--color-net)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

