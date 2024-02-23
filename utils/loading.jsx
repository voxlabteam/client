import React from 'react'
import HashLoader from 'react-spinners/HashLoader'

import "../src/style/loading.css"

const Loading = () => {
  return (
    <div className='loading'>
        <HashLoader size={70} color='#EBE76C'/>
    </div>
  )
}

export default Loading