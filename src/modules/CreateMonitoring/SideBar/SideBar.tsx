import { FC, memo } from 'react'
import { TYPE_MONITORING } from '../../../helpers/constants'
import styles from './SideBar.module.scss'
import { Tabs } from 'antd'
import { Html5Outlined, CodeOutlined, FormOutlined } from '@ant-design/icons'

interface SideBarProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>, item: any) => void
}

const SideBar: FC<SideBarProps> = ({ onDragStart }) => {
  const generateElement = (type: string) => {
    switch (type) {
      case 'html':
        return (
          <div className={styles.item}>
            <div className={styles.icon}>
              <Html5Outlined />
            </div>

            <div className={styles.body}>
              <div className={styles.title}>HTML</div>

              <div className={styles.desc}>Implement like text, title, image, ...</div>
            </div>
          </div>
        )

      case 'python':
        return (
          <div className={styles.item}>
            <div className={styles.icon}>
              <CodeOutlined />
            </div>

            <div className={styles.body}>
              <div className={styles.title}>Python</div>

              <div className={styles.desc}>
                Implemet your function and return to{' '}
                <a
                  onClick={() => {
                    window.open('https://docs.zalo.services/display/ZAR/AutoEDA%20Common%20Lib%20v2', '_blank')
                  }}
                >
                  our format
                </a>{' '}
                !
              </div>
            </div>
          </div>
        )

      case 'form':
        return (
          <div className={styles.item}>
            <div className={styles.icon}>
              <FormOutlined />
            </div>

            <div className={styles.body}>
              <div className={styles.title}>Form</div>

              <div className={styles.desc}>Implement your form action like input, slider, select, ...</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.root}>
      <Tabs
        className={styles.tabs}
        items={[
          {
            key: '1',
            label: 'LAYOUT ELEMENTS',
            children: (
              <div className={styles.children}>
                {TYPE_MONITORING.map((item) => {
                  return (
                    <div key={item} className={styles.item} draggable onDragStart={(e) => onDragStart(e, item)}>
                      {generateElement(item)}
                    </div>
                  )
                })}
              </div>
            )
          },
          {
            key: '2',
            label: 'CHARTS',
            children: (
              <div className={styles.children}>
                <h3>Comming Soon!</h3>
              </div>
            )
          }
        ]}
      />
    </div>
  )
}

export default memo(SideBar)
