// components/StatsChart.tsx
import { Line } from "react-chartjs-2";
import { MyStats } from "@/app/types/api";

interface Props {
  stats: MyStats;
}

export default function StatsChart({ stats }: Props) {
  const data = {
    labels: stats.peakHours.map((h) => `${h.hour}:00`),
    datasets: [
      {
        label: "Số chuyến thuê",
        data: stats.peakHours.map((h) => h.count),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
      },
    ],
  };

  return stats.peakHours.length > 0 ? (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Thống kê giờ thuê</h2>
        <Line data={data} options={{ responsive: true }} />
      </div>
    </div>
  ) : null;
}
