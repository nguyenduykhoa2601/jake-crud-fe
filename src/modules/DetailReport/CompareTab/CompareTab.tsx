import { FC, useEffect, useState } from 'react'

import styles from './CompareTab.module.scss'
import { Skeleton, Tabs } from 'antd'
import { reportApi } from '../../../api/reportApi'
import HTMLCard from '../HTMLCard/HTMLCard'
import Error from '../../../components/Error/Error'

interface CompareTabProps {
  path: string
  status: string
}

const CompareTab: FC<CompareTabProps> = ({ path, status }) => {
  const [filesName, setFilesName] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    reportApi
      .getReportCompareFileName(path)
      .then((res) => {
        setFilesName(res.data)
        setIsLoading(false)
      })
      .catch((_) => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className={styles.root}>
      {status === 'success' && (
        <Skeleton loading={isLoading}>
          <Tabs
            className={styles.tabs}
            items={filesName.map((item) => {
              return {
                key: item,
                label: item.split('/').slice(-1),
                children: <HTMLCard id='' path={item} status={status} />
              }
            })}
          />
        </Skeleton>
      )}

      {status === 'failed' && <Error />}
    </div>
  )
}

export default CompareTab
