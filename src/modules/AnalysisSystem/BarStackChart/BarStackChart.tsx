import { RootState, useAppSelector } from '../../../redux/store'
import styles from './BarStackChart.module.scss'
import EChartsReact from 'echarts-for-react'

const colorMapping = {
  pending: '#1890ff', // Light blue
  success: '#52c41a', // Green
  failed: '#cf1322' // Dark red
}

const BarStackChart = () => {
  const { detailNumStatusReport } = useAppSelector((state: RootState) => state.summary)

  const categories = Object.keys(detailNumStatusReport)
  const statuses = ['success', 'pending', 'failed'] // Assuming you have only three statuses
  const seriesData = statuses.map((status) => ({
    name: status,
    type: 'bar',
    stack: 'total',
    label: {
      show: true,
      formatter: (params: any) => {
        if (params.value <= 3) {
          return ''
        }
        return params.value
      }
    },
    itemStyle: {
      // @ts-ignore
      color: colorMapping[status]
    },
    data: categories.map((category) => detailNumStatusReport[category][status] || 0)
  }))

  return (
    <div className={styles.root}>
      <EChartsReact
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#fff',
          paddingTop: '20px',
          borderRadius: '10px'
        }}
        option={{
          title: {
            text: 'Summary status types of report',
            left: 20
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {
            orient: 'verical',
            top: 0,
            right: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: Object.keys(detailNumStatusReport).map((k) => k)
          },
          yAxis: {
            type: 'value'
          },
          series: seriesData
        }}
      />
    </div>
  )
}

export default BarStackChart
