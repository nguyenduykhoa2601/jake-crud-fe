/* eslint-disable @typescript-eslint/no-explicit-any */
import { LIST_REPORT } from './constants'

export const toUpperCaseFistChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const randomColor = () => {
  const sampleColor = ['gold', 'cyan', 'lime', 'green']
  return sampleColor[Math.floor(Math.random() * sampleColor.length)]
}

export const parseDMYhm = (s: string) => {
  return new Date(s)
}

export const filterSelectByValue = (options: Array<any>, listValue: Array<string>) => {
  const res: any[] = []
  options.forEach((item) => {
    listValue.forEach((k) => {
      if (k === item?.value) {
        res.push(item)
      }
    })
  })

  return res
}

export const checkIsExitPath = (listPath: Array<any>, path: any) => {
  let isExist = false
  for (let i = 0; i < listPath.length; i++) {
    if (listPath[i]?.path === path) {
      isExist = true
      break
    }
  }

  return isExist
}

export const indexOfArr = (arr: Array<string>, value: string) => {
  let index = -1
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      index = i
      break
    }
  }

  return index
}

export const compareTwoObject = (obj1: any, obj2: any) => {
  const obj1Keys = Object.keys(obj1).sort()
  const obj2Keys = Object.keys(obj2).sort()
  let objEqual = false
  if (obj1Keys.length !== obj2Keys.length) {
    // console.log(objEqual)
  } else {
    const areEqual = obj1Keys.every((key, index) => {
      const objValue1 = obj1[key]
      const objValue2 = obj2[obj2Keys[index]]
      return objValue1 === objValue2
    })
    if (areEqual) {
      objEqual = true
    } else {
      objEqual = false
    }
  }

  return objEqual
}

export const mapUserFeatures = (userFeatures: Array<any>, defaultFeatures: Array<any>) => {
  const res: Array<any> = []

  defaultFeatures.forEach((eF) => {
    res.push({
      value: eF,
      label: <div style={{ color: '#1a8ffb' }}>{eF}</div>
    })
  })

  userFeatures.forEach((uF) => {
    if (!checkExistInArr(res, uF)) {
      res.push({
        value: uF,
        label: uF
      })
    }
  })

  return res
}

const checkExistInArr = (arr: Array<any>, value: any) => {
  let isExist = false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value === value) {
      isExist = true
      break
    }
  }

  return isExist
}

export const stringIsExitsInArr = (arr: Array<any>, value: any) => {
  let isExist = false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      isExist = true
      break
    }
  }

  return isExist
}

export const filterListReport = (tabs: Array<any>) => {
  return LIST_REPORT.filter((report) => !tabs.includes(report.value)).map((item) => {
    return item.text
  })
}

export const getGreeting = () => {
  // Get the current time in UTC
  const currentUTC = new Date()

  // Get the current hour in UTC+7
  const currentHourUTCPlus7 = currentUTC.getUTCHours() + 7

  // Greet based on the current hour
  if (currentHourUTCPlus7 >= 5 && currentHourUTCPlus7 < 12) {
    return 'Good Morning'
  } else if (currentHourUTCPlus7 >= 12 && currentHourUTCPlus7 < 18) {
    return 'Good Afternoon'
  } else {
    return 'Good Evening'
  }
}

export const parseMenuNameToRouterPath = (menuName: string) => {
  return menuName.toLowerCase().replaceAll(' ', '-').replaceAll('/', '')
}

export const getTotalFinish = (data?: any) => {
  let total = 0

  Object.keys(data).map((k) => {
    total += data[k].success + data[k].failed
  })

  return total.toString()
}

export const getTotalPending = (data?: any) => {
  let total = 0

  Object.keys(data).map((k) => {
    total += data[k].pending
  })

  return total.toString()
}

export const extractKeyWithTime = (key: string, list: any) =>
  list.map(({ Time, [key]: value }: any) => ({ Time, [key]: value }))
