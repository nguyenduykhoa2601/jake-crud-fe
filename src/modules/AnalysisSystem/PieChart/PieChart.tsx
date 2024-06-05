import EChartsReact from 'echarts-for-react'

import { RootState, useAppSelector } from '../../../redux/store'

const PieChart = () => {
  const {
    numAutoml,
    numCommunication,
    numCompare,
    numDemographics,
    numCommunity,
    numInterest,
    numLocation,
    numReading
  } = useAppSelector((state: RootState) => state.summary)

  return (
    <EChartsReact
      style={{
        width: '100%',
        height: '600px',
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: '20px',
        borderRadius: '10px'
      }}
      option={{
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          top: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: numDemographics, name: 'Demographics' },
              { value: numLocation, name: 'Location' },
              { value: numCommunity, name: 'Community' },
              { value: numCommunication, name: 'Communication' },
              { value: numCompare, name: 'Compare' },
              { value: numInterest, name: 'Interest' },
              { value: numReading, name: 'Reading' },
              { value: numAutoml, name: 'AutoML' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }}
    />
  )
}

export default PieChart
