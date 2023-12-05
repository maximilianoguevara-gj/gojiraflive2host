import qs from 'qs'
import { useEffect, useState } from 'react'

const useQueryParams = () => {
  const [params, setParams] = useState(null)

  useEffect(() => {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true })

    setParams(params)
  }, [window.location.search])

  return { params }
}

export default useQueryParams
