import { FC, memo, useEffect, useState } from 'react'
import styles from './HTMLCard.module.scss'

import { Button, Skeleton } from 'antd'
import { reportApi } from '../../../api/reportApi'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'

interface HTMLCardProps {
  status: string
  id?: string
  path?: string
}

const HTMLCard: FC<HTMLCardProps> = ({ status, id, path }) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [iframeHeight, setIframeHeight] = useState('auto')

  const handleLoad = (event: any) => {
    const iframeDocument = event.target.contentDocument
    if (iframeDocument) {
      setIframeHeight(`${iframeDocument.documentElement.scrollHeight}px`)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    if (!path && id) {
      reportApi
        .getReport(id)
        .then((res) => {
          setData(res)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching report:', error)
          setIsLoading(false)
        })
    } else {
      reportApi
        .getReportByPath(path ?? '')
        .then((res) => {
          setData(res)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching report:', error)
          setIsLoading(false)
        })
    }
  }, [id, path])

  const downloadAsHTML = () => {
    if (data) {
      const blob = new Blob([data], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'report.html' // Default name for download
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.root}>
      <Skeleton loading={isLoading}>
        {status === 'success' && data && (
          <>
            <Button className={styles.download} onClick={downloadAsHTML}>
              Download as HTML
            </Button>
            <iframe
              title='HTML Content'
              srcDoc={data}
              style={{ width: '100%', height: iframeHeight, border: 'none', maxHeight: '750px' }}
              onLoad={handleLoad}
            />
          </>
        )}

        {status === 'pending' && <Loading />}

        {status === 'failed' && <Error />}
      </Skeleton>
    </div>
  )
}

export default memo(HTMLCard)
