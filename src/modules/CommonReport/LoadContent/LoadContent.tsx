import { Button, Input, Radio, Upload } from 'antd'
import styles from './LoadContent.module.scss'
import { useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store'
import { doGetColumnsFromHDFS, doUploadFile } from '../../../redux/actions/hdfs'
import { doSetPath } from '../../../redux/slice/SliceAPI/hdfs'
import { useHistory, useLocation } from 'react-router-dom'

const LoadContent = () => {
  const [typeUpload, setTypeUpload] = useState(1)
  const [currFile, setCurrFile] = useState<any>(null)
  const { isLoading, path: pathHDFS } = useAppSelector((state: RootState) => state.hdfs)
  const [path, setPath] = useState(
    pathHDFS && pathHDFS.length > 0
      ? pathHDFS
      : '/data/jobs/rnd/production/fstore/zml_offline_store_data_prod/benchmark_uid/uid_200k'
  )
  const { userID } = useAppSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const history = useHistory()

  return (
    <div className={styles.root}>
      <Radio.Group onChange={(e) => setTypeUpload(e.target.value)} value={typeUpload}>
        <Radio value={1}>HDFS Path</Radio>
        <Radio value={2}>CSV Upload</Radio>
      </Radio.Group>

      <div className={styles.content}>
        {typeUpload === 1 && (
          <Input
            size='large'
            placeholder={'Ex: /rnd/production/...'}
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        )}

        {typeUpload === 2 && (
          <Upload
            accept='.csv'
            multiple={false}
            className={styles.upload}
            showUploadList={false}
            onChange={(files) => {
              setCurrFile(files?.fileList[files.fileList.length - 1])
            }}
          >
            <Button>{currFile ? currFile.name : '+ Click/Drop to upload'}</Button>
          </Upload>
        )}

        <Button
          type='primary'
          disabled={isLoading ? true : false}
          className={styles.btnSubmit}
          onClick={() => {
            if (typeUpload === 1) {
              dispatch(doGetColumnsFromHDFS(path))
              dispatch(doSetPath(path))
            } else {
              const formData = new FormData()
              formData.append('file', currFile?.originFileObj)

              dispatch(doUploadFile(formData))
              dispatch(
                doSetPath(
                  '/data/jobs/rnd/production/zml_autoeda/files/upload/' +
                    userID +
                    '/' +
                    currFile.name.replace('.csv', '.parquet')
                )
              )
            }

            if (location.pathname === '/') {
              history.push('/common-reports')
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default LoadContent
