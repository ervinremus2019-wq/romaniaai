import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStrategyGoals } from "@/hooks/use-strategy";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#1e40af', '#eab308', '#dc2626', '#10b981'];

export default function StrategyDashboard() {
  const { data: goals, isLoading } = useStrategyGoals();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Transform data for charts
  const statusData = goals ? [
    { name: 'Pending', value: goals.filter(g => g.status === 'pending').length },
    { name: 'In Progress', value: goals.filter(g => g.status === 'in_progress').length },
    { name: 'Completed', value: goals.filter(g => g.status === 'completed').length },
  ] : [];

  const categoryData = goals ? Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container-page">
        <PageHeader 
          title="Strategy Dashboard" 
          description="Real-time tracking of the National AI Strategy goals and implementation progress (2024-2027)."
        />

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Goals by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-800"></div>Pending</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div>In Progress</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div>Completed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-primary">Key Strategic Goals</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {goals?.map((goal, idx) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 uppercase tracking-wider">
                        {goal.category}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded capitalize
                        ${goal.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          goal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}
                      `}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{goal.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{goal.description}</p>
                    
                    <div className="relative pt-2">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-primary">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary/10">
                        <div style={{ width: `${goal.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
