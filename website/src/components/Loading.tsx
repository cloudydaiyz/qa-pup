import React from 'react'
import LoadingOval from './svg/LoadingOval'
import './Loading.css'

const Loading = () => {
  return (
    <div className='loading'>
        <LoadingOval />
        <h3>Loading...</h3>
    </div>
  )
}

export default Loading