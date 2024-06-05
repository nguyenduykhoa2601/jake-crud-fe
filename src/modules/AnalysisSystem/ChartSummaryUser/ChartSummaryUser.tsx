import React from 'react'
import { RootState, useAppSelector } from '../../../redux/store'
import EChartsReact from 'echarts-for-react'
import styles from './ChartSummaryUser.module.scss'

// Assuming colorMapping is an object that maps each type to a color
const colorMapping: Record<string, string> = {
  demographics: '#5470C6',
  location: '#91CC75',
  communication: '#FAC858',
  interest: '#EE6666',
  reading: '#73C0DE',
  community: '#3BA272',
  compare: '#FC8452',
  automl: '#9A60B4'
}

const ChartSummaryUser: React.FC = () => {
  const { summaryReportByUser } = useAppSelector((state: RootState) => state.summary)
  const { allUsers } = useAppSelector((state: RootState) => state.admin)

  const generateInfo = (id: string) => {
    const user = allUsers.find((item) => item.user_app_id === id)
    return user?.zalo_name || ''
  }

  const seriesTypes = [
    'demographics',
    'location',
    'communication',
    'interest',
    'reading',
    'community',
    'compare',
    'automl'
  ]

  const seriesData = seriesTypes.map((type) => ({
    name: type,
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
      color: colorMapping[type]
    },
    data: summaryReportByUser.info.map((userReport: Record<string, number>) => userReport[type] || 0)
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
            text: 'Summary reports by user',
            left: 20
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            right: 0
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: summaryReportByUser.users.map((id: string) => {
              return generateInfo(id)
            }) // Using index for simplicity, replace with actual user IDs if available
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

export default ChartSummaryUser
