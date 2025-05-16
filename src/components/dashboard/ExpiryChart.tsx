
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpiryData {
  name: string;
  count: number;
}

interface ExpiryChartProps {
  data: ExpiryData[];
  isLoading?: boolean;
}

const ExpiryChart = ({ data, isLoading = false }: ExpiryChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Expiries</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-80 w-full animate-pulse rounded-md bg-muted"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Expiries</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {data.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="count" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]} 
                barSize={30} 
                name="Subscriptions"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiryChart;
