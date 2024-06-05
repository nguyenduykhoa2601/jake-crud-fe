import { CURRENT_VERSION } from '../helpers/constants'
import styles from './MainLayout.module.scss'

const withMainLayout = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function withMainLayout(props: P) {
    return (
      <div className={styles.root}>
        <WrappedComponent {...props} />

        <div className={styles.root}>
          <div className={styles.footerLeft}>Version: {CURRENT_VERSION}, by Khoa Nguyen </div>

          <div className={styles.footerRight}>Copyright © 2024. All rights reserved.</div>
        </div>
      </div>
    )
  }
}

export default withMainLayout
