
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

interface PlatformData {
  name: string;
  value: number;
  color: string;
}

interface PlatformInfo {
  name: string;
  count: number;
  revenue: number;
}

interface TopPlatformsProps {
  platforms: PlatformInfo[];
  isLoading?: boolean;
}

// Array of colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TopPlatforms = ({ platforms, isLoading = false }: TopPlatformsProps) => {
  // Convert platform data to the format expected by recharts
  const data: PlatformData[] = platforms.map((platform, index) => ({
    name: platform.name,
    value: platform.revenue,
    color: COLORS[index % COLORS.length],
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full animate-pulse rounded-md bg-muted"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Platforms</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={1}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Legend align="center" verticalAlign="bottom" layout="horizontal" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPlatforms;
