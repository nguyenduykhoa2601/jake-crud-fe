import { FC } from 'react'
import styles from './Card.module.scss'

interface CardProps {
  title: string
  value: string
  style?: React.CSSProperties
  desc?: string
}

const Card: FC<CardProps> = ({ title, value, style, desc }) => {
  return (
    <div className={styles.root} style={style}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>

        <div className={styles.desc}>{desc}</div>
      </div>

      <div className={styles.value}>{value}</div>
    </div>
  )
}

export default Card
