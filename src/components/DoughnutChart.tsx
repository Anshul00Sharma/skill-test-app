"use client";
import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  showResult: boolean;
  targetScore?: number;
}

export default function DoughnutChart({
  showResult,
  targetScore = 60,
}: DoughnutChartProps) {
  const [score, setScore] = useState(0);
  const animationRef = useRef<number>(0);
  const animationStartRef = useRef<number>(0);

  const animate = (timestamp: number) => {
    if (!animationStartRef.current) {
      animationStartRef.current = timestamp;
    }
    const progress = timestamp - animationStartRef.current;
    const duration = 2000; // 2 seconds

    if (progress < duration) {
      const percentage = Math.min(
        Math.round((progress / duration) * targetScore),
        targetScore
      );
      setScore(percentage);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setScore(targetScore);
    }
  };

  useEffect(() => {
    if (showResult) {
      animationStartRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setScore(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showResult, targetScore]);

  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.formattedValue}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="h-[40%] w-[80%] relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800">{score}%</div>
          <div className="text-sm text-gray-500">Score</div>
        </div>
      </div>

      <Doughnut data={chartData} options={chartOptions} redraw={showResult} />
    </div>
  );
}
