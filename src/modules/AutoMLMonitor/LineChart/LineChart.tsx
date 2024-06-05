import { FC, memo } from 'react'
import EChartsReact from 'echarts-for-react'

import styles from './LineChart.module.scss'

interface LineChartProps {
  dataChart: Array<any>
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const LineChart: FC<LineChartProps> = ({ dataChart }) => {
  // Get the keys excluding 'Time'
  const keys = Object.keys(dataChart[0]).filter((k) => k !== 'Time')

  return (
    <EChartsReact
      style={{ width: '100%', height: '100%', minHeight: '300px' }}
      option={{
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: keys // Use the filtered keys
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataChart?.map((item) => {
            return item.Time
          })
        },
        yAxis: {
          type: 'value'
        },
        series: keys.map((k) => {
          return {
            name: k,
            type: 'line',
            smooth: true,
            data: dataChart?.map((item) => {
              return item[k]
            }),
            itemStyle: {
              color: getRandomColor()
            },
            lineStyle: {
              color: getRandomColor()
            }
          }
        })
      }}
    />
  )
}

export default memo(LineChart)
