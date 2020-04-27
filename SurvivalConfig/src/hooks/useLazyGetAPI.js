import _ from 'lodash'
import { useState } from 'react'
import API from '../api'

export default function useLazyGetAPI(options) {
  const onCompleted = _.get(options, 'onCompleted')
  const onError = _.get(options, 'onError')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [data, setData] = useState()

  const get = endpoint => {
    setLoading(true)
    return API.get(endpoint)
      .then(response => {
        const payload = _.get(response, 'data.payload')
        if (payload) {
          setData(payload)
          setLoading(false)
          if (onCompleted) {
            onCompleted(payload)
          }
        }
        return Promise.resolve(payload)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
        if (onError) {
          onError(error.response)
        }
        return Promise.reject(error.response)
      })
  }

  return [get, { data, loading, error, refetch: get }]
}
