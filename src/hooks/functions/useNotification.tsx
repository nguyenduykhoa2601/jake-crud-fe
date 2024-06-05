import { notification } from 'antd'
import { useEffect } from 'react'

interface NotificationProps {
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
  description: string
}

const useNotification = () => {
  const openNotification = ({ type, message, description }: NotificationProps) => {
    notification[type]({
      message,
      description
    })
  }

  useEffect(() => {
    // This effect can be used to handle cleanup if needed
    return () => {
      // Clean up resources if necessary
    }
  }, [])

  return {
    openNotification
  }
}

export default useNotification
