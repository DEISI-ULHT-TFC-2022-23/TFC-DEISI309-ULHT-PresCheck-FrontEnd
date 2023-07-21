import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const GraficoBarrasAgrupadas = ({ labels, valorPrimeiro, valorSegundo, labelPrimeiro, labelSegundo, labelY}) => {
  const chartRef = useRef(null);

  useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
      

      const data = {
        labels: labels,
        datasets: [
          {
            label: labelPrimeiro,
            data: valorPrimeiro,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: labelSegundo,
            data: valorSegundo,
            backgroundColor: 'rgba(192, 75, 75, 0.6)',
            borderColor: 'rgba(192, 75, 75, 1)',
            borderWidth: 1,
          },
        ],
      };

      const options = {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: labelY,
            },
          },
        },
      };

      const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options,
      });

      return () => {
        chartInstance.destroy();
      };
    
  }, [valorPrimeiro, valorSegundo, labelPrimeiro, labelSegundo, labelY, labels]);

  return <canvas ref={chartRef}></canvas>;

}

export default GraficoBarrasAgrupadas;


