import { Avatar } from 'antd'
import { RootState, useAppSelector } from '../../../redux/store'
import styles from './LineChart.module.scss'
import EChartsReact from 'echarts-for-react'

const LineChart = () => {
  const {
    infoSummaryByTime,
    timeSeries: unsortedTimeSeries,
    infoReportsByTime
  } = useAppSelector((state: RootState) => state.summary)
  const { allUsers } = useAppSelector((state: RootState) => state.admin)

  // Create a copy of the time series array and then sort it
  // @ts-ignore
  const timeSeries = [...unsortedTimeSeries].sort((a, b) => new Date(a) - new Date(b))

  const generateInfo = (id: any) => {
    const filter = allUsers.filter((item) => item.user_app_id === id)

    if (filter.length > 0) {
      return filter[0]
    }

    return null
  }

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
            text: 'Summary users by date',
            left: 20
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            },
            formatter: (params: any) => {
              const date = params[0].axisValue

              let content = `<strong>${date}</strong><br><br>`

              // Iterate through each series
              params.forEach((param: any) => {
                if (param.seriesName === 'Total Submit') {
                  content += '<div><strong>Total Submit:</strong><br>'
                  Object.keys(infoSummaryByTime[date]).forEach((user_app_id) => {
                    if (generateInfo(user_app_id)) {
                      const info = generateInfo(user_app_id)
                      content += `<div key=${user_app_id} style="display: flex; column-gap: 20px; align-items: center; margin-bottom: 10px; margin-top: 10px">
                        <div>
                          <img src="${info?.avatar_url}" style="border-radius: 50%; width: 30px; height: 30px;" />
                          <span>${info?.zalo_name}</span>
                        </div>
                        <div>${infoSummaryByTime[date][user_app_id]}</div>
                      </div>`
                    }
                  })
                  content += '</div>'
                } else if (param.seriesName === 'Total Reports') {
                  content += '<div><strong>Total Reports:</strong><br>'
                  Object.keys(infoReportsByTime[date]).forEach((user_app_id) => {
                    if (generateInfo(user_app_id)) {
                      const info = generateInfo(user_app_id)
                      content += `<div key=${user_app_id} style="display: flex; column-gap: 20px; align-items: center; margin-bottom: 10px; margin-top: 10px">
                        <div>
                          <img src="${info?.avatar_url}" style="border-radius: 50%; width: 30px; height: 30px;" />
                          <span>${info?.zalo_name}</span>
                        </div>
                        <div>${infoReportsByTime[date][user_app_id]}</div>
                      </div>`
                    }
                  })
                  content += '</div>'
                }
              })

              return content
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
            data: timeSeries
          },
          yAxis: [
            {
              type: 'value',
              // name: 'Total Submit',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              // name: 'Total Reports',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: 'Total Submit',
              data: timeSeries.map((item) => {
                let total = 0
                Object.keys(infoSummaryByTime[item]).forEach((k) => {
                  total += infoSummaryByTime[item][k]
                })

                return total
              }),
              type: 'line',
              label: {
                show: true,
                formatter: '{c}'
              }
            },
            {
              name: 'Total Reports',
              data: timeSeries.map((item) => {
                let total = 0
                Object.keys(infoReportsByTime[item]).forEach((k) => {
                  total += infoReportsByTime[item][k]
                })

                return total
              }),
              // yAxisIndex: 1,
              type: 'line',
              label: {
                show: true,
                formatter: '{c}'
              }
            }
          ]
        }}
      />
    </div>
  )
}

export default LineChart
