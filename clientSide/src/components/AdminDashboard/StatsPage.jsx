// src/components/AdminDashboard/StatsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  PackageCheck,
  FolderKanban,
  BadgeCheck,
  UserPlus,
  CreditCard,
  MailOpen,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Sector,
  LabelList,
} from "recharts";

const StatsPage = () => {
  const [stats, setStats] = useState({
    users: 10,
    partnersPending: 6,
    equipment: 12,
    rentals: 8,
    payments: 4,
    messages: 7,
  });

  const [monthlyStats, setMonthlyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // For demo purposes, we'll use mock data instead of API
        // Uncomment this for real API call
        /*
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          withCredentials: true,
        });
        setStats(res.data);
        */

        // Simulate API delay
        setTimeout(() => {
          generateMonthlyStats();
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching stats", err);
        // Generate demo data if API fails
        generateMonthlyStats();
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Custom axis tick component for X-axis (numbers)
  const CustomAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          style={{ fontSize: "12px" }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom axis tick component for Y-axis (Arabic text)
  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-10}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#666"
          style={{ fontSize: "12px", direction: "rtl" }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Generate sample monthly stats for demonstration
  const generateMonthlyStats = () => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const demoData = months.map((month, index) => {
      // Use increasing trend for better visualization
      const multiplier = (index + 1) / 12;
      return {
        name: month,
        المستخدمين: Math.floor(5 + 25 * multiplier),
        المعدات: Math.floor(3 + 27 * multiplier),
        الطلبات: Math.floor(2 + 18 * multiplier),
        المدفوعات: Math.floor(1 + 29 * multiplier),
      };
    });
    setMonthlyStats(demoData);
  };

  // Data for main overview chart - using Arabic labels
  const overviewData = [
    {
      name: "المستخدمين",
      value: stats.users,
      color: "#fbbf24",
      fillOpacity: 1,
    },
    {
      name: "طلبات الشراكة",
      value: stats.partnersPending,
      color: "#fb923c",
      fillOpacity: 1,
    },
    {
      name: "المعدات",
      value: stats.equipment,
      color: "#60a5fa",
      fillOpacity: 1,
    },
    { name: "الطلبات", value: stats.rentals, color: "#4ade80", fillOpacity: 1 },
    {
      name: "المدفوعات",
      value: stats.payments,
      color: "#a855f7",
      fillOpacity: 1,
    },
    {
      name: "الرسائل",
      value: stats.messages,
      color: "#f87171",
      fillOpacity: 1,
    },
  ];

  // Data for pie chart - rental status distribution (demo data)
  const rentalStatusData = [
    { name: "قيد الانتظار", value: 30, color: "#fbbf24", percentage: "30%" },
    { name: "مقبول", value: 40, color: "#4ade80", percentage: "40%" },
    { name: "مرفوض", value: 20, color: "#f87171", percentage: "20%" },
    { name: "مكتمل", value: 10, color: "#60a5fa", percentage: "10%" },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-right"
          dir="rtl"
        >
          <p className="font-semibold text-gray-700 mb-1">
            {label || payload[0].name}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color || entry.payload.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Function for pie chart active sector
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Renders active sector in pie chart
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-20}
          textAnchor="middle"
          fill={fill}
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={10}
          textAnchor="middle"
          fill="#333"
          style={{ fontSize: "20px", fontWeight: "bold" }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };

  // Custom label for bar chart
  const renderCustomBarLabel = ({ x, y, width, height, value, index }) => {
    return (
      <text
        x={x + width + 10}
        y={y + height / 2}
        fill={overviewData[index].color}
        textAnchor="start"
        dominantBaseline="middle"
        style={{ fontSize: "12px", fontWeight: "bold" }}
      >
        {value}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="text-right space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-800">الإحصائيات العامة</h2>
        <div className="bg-yellow-50 rounded-lg px-4 py-2 flex items-center text-yellow-700">
          <TrendingUp className="ml-2" size={20} />
          <span className="font-medium">آخر تحديث: اليوم</span>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Users className="text-yellow-600" size={24} />
          </div>
          <div className="mr-4">
            <h3 className="text-sm text-gray-500">إجمالي المستخدمين</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <PackageCheck className="text-blue-600" size={24} />
          </div>
          <div className="mr-4">
            <h3 className="text-sm text-gray-500">عدد المعدات</h3>
            <p className="text-2xl font-bold text-gray-800">
              {stats.equipment}
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full">
            <CreditCard className="text-green-600" size={24} />
          </div>
          <div className="mr-4">
            <h3 className="text-sm text-gray-500">إجمالي المدفوعات</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.payments}</p>
          </div>
        </div>
      </div>

      {/* IMPROVED Bar Chart: Overview of all stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">نظرة عامة</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overviewData}
              layout="vertical"
              margin={{ top: 5, right: 50, left: 40, bottom: 5 }}
              barSize={20}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={<CustomAxisTick />}
                domain={[0, "dataMax + 2"]}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                axisLine={false}
                tickLine={false}
                tick={<CustomYAxisTick />}
                mirror
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                wrapperStyle={{ zIndex: 100 }}
              />
              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
                label={renderCustomBarLabel}
              >
                {overviewData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line and Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMPROVED Line Chart: Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">التطور الشهري</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyStats.slice(-6)} // Show only last 6 months for better visualization
                margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ direction: "rtl", zIndex: 100 }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: "10px", direction: "rtl" }}
                />
                <Line
                  type="monotone"
                  dataKey="المستخدمين"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="المعدات"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="الطلبات"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="المدفوعات"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IMPROVED Pie Chart: Rental Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">توزيع حالات الطلبات</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={rentalStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {rentalStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{
                        filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ direction: "rtl", zIndex: 100 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-3 mt-4">
            {rentalStatusData.map((entry, index) => (
              <div
                key={index}
                className="flex items-center cursor-pointer"
                onClick={() => setActiveIndex(index)}
              >
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs text-gray-600">
                  {entry.name} ({entry.percentage})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
