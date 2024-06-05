import { FC, memo, useEffect, useState } from 'react'
import InnerHTML from 'dangerously-set-html-content'

import styles from './PreviewComponent.module.scss'
import { monitoringApi } from '../../../api/monitoringApi'
import { Button, Skeleton, Spin } from 'antd'
import DynamicForm from '../DynamicForm/DynamicForm'
import useNotification from '../../../hooks/useNotification'
import { useAppDispatch } from '../../../redux/store'
import { doGetMonitorInfo } from '../../../redux/actions/monitoring'
import { useParams } from 'react-router-dom'

interface PreviewComponentProps {
  info: any
  type: string
}

const PreviewComponent: FC<PreviewComponentProps> = ({ info, type }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState(null)
  const { id } = useParams<{ id: string }>()

  const [iframeHeight, setIframeHeight] = useState('auto')

  const [onFormChange, setOnFormChange] = useState<any>(info?.form)

  const [isFiltering, setIsFiltering] = useState(false)

  const dispatch = useAppDispatch()

  const handleLoad = (event: any) => {
    const iframeDocument = event.target.contentDocument
    if (iframeDocument) {
      setIframeHeight(`${iframeDocument.documentElement.scrollHeight}px`)
    }
  }

  const { openNotification } = useNotification()

  useEffect(() => {
    if (type === 'python' && info && !info.is_executing) {
      setIsLoading(true)
      monitoringApi
        .getComponentPythonResult({
          id: info?._id
        })
        .then((res) => {
          if (typeof res === 'string') {
            setData(res)
          } else {
            setError(res)
          }
          setIsLoading(false)
        })
        .catch((err) => {
          setError(err)
        })
    }
  }, [info, type])

  console.log('onFormChange', onFormChange)

  return (
    <div className={styles.root}>
      {type === 'html' && <InnerHTML html={info && info?.code?.length > 0 ? info?.code : '<div></div>'} />}

      {type === 'python' && (
        <Skeleton
          active
          className={styles.ske}
          loading={info?.is_executing || isLoading || error || (info && info.is_executing)}
        >
          {info && info.status === 'success' && (
            <iframe
              title='HTML Content'
              srcDoc={data ?? ''}
              style={{ width: '100%', height: iframeHeight, border: 'none', maxHeight: '750px' }}
              onLoad={handleLoad}
            />
          )}
        </Skeleton>
      )}

      {type === 'form' && info && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DynamicForm initValue={info?.form} onChange={(e) => setOnFormChange(e)} isPreview={true} />

          <Button
            type='primary'
            style={{ maxWidth: '200px' }}
            onClick={() => {
              setIsFiltering(true)

              monitoringApi
                .updateComponent({
                  id: info?._id,
                  code: info?.code,
                  dependOn: info?.depend_on_components,
                  name: info?.name,
                  schedule_timeout: info?.schedule_timeout,
                  type: info?.type,
                  form: onFormChange
                })
                .then((res) => {
                  if (res.code === 0) {
                    dispatch(
                      doGetMonitorInfo({
                        id: id
                      })
                    )

                    monitoringApi.executeComponentPython({
                      componentId: info?._id,
                      monitorId: id
                    })

                    openNotification({
                      type: 'success',
                      message: 'Your component has been updated',
                      description: ''
                    })

                    setIsFiltering(false)
                  } else {
                    openNotification({
                      type: 'error',
                      message: res.msg,
                      description: ''
                    })

                    setIsFiltering(false)
                  }
                })
            }}
          >
            Submit {isFiltering && <Spin />}
          </Button>
        </div>
      )}
    </div>
  )
}

export default memo(PreviewComponent)
