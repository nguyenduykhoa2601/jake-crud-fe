import { Skeleton } from 'antd'
import { getTotalFinish, getTotalPending } from '../../../helpers/utils'
import { RootState, useAppSelector } from '../../../redux/store'
import Card from '../Card/Card'
import styles from './TotalSummary.module.scss'
import BarStackChart from '../BarStackChart/BarStackChart'
import LineChart from '../LineChart/LineChart'
import ChartSummaryUser from '../ChartSummaryUser/ChartSummaryUser'

const TotalSummary = () => {
  const { isLoading, numTotalReport, numTotalSubmit, detailNumStatusReport, summaryReportByUser } = useAppSelector(
    (state: RootState) => state.summary
  )

  return (
    <div className={styles.root}>
      <Skeleton loading={isLoading}>
        <div className={styles.header}>
          <Card
            style={{ backgroundColor: '#8A5CD1', flex: 1 }}
            desc={`Total group report submitted`}
            title='Total Submitted'
            value={numTotalSubmit.toString()}
          />

          <Card
            desc={`Number of reports used`}
            style={{ backgroundColor: '#66CCCC', flex: 1 }}
            title='Total Reports'
            value={numTotalReport.toString()}
          />

          <Card
            desc={`Number of reports finished (including success and failed)`}
            style={{ backgroundColor: '#FF7F50', flex: 2 }}
            title='Total Finished Reports'
            value={getTotalFinish(detailNumStatusReport)}
          />
        </div>

        <div className={styles.body}>
          <div style={{ flex: 1 }}>
            <BarStackChart />
          </div>

          <div style={{ flex: 2 }}>
            <LineChart />
          </div>
        </div>

        <div className={styles.footer}>{summaryReportByUser && <ChartSummaryUser />}</div>
      </Skeleton>
    </div>
  )
}

export default TotalSummary
