import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useCommentSearch(id, pageNumber, API, API_KEY) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [comments, setComments] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setComments([])
  }, [id])

  useEffect(() => {
    console.log("girdik")
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: API + '/Business/GetCommentsByUser',
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      params: { userid:id,page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
        console.log(res.data.data);
      setComments(prevComments => {
        return [...new Set([...prevComments, ...res.data.data])]
      })
      setHasMore(res.data.data > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [id,pageNumber])

  return { loading, error, comments, hasMore }
}