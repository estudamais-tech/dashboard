// components/MetricCard.jsx (ou .tsx)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Supondo que você tenha uma utilidade para concatenar classes
import { LucideIcon } from "lucide-react"; // Importar LucideIcon

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon; // Usando LucideIcon como tipo para o ícone
  trend: 'up' | 'down' | 'neutral';
  className?: string; // Adicione esta linha para aceitar className
}

export function MetricCard({ title, value, change, icon: Icon, trend, className }: MetricCardProps) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }[trend];

  return (
    // Aplique a prop className aqui ao componente Card, combinando com as classes de dark mode
    <Card className={cn("dark:bg-gray-800 dark:border-gray-700", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-300" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold dark:text-white">{value}</div>
        <p className={cn(`text-xs`, trendColor, 'dark:text-gray-300')}>
          {change} em relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  );
}
