import React from 'react'
import axios from 'axios'
import Routing from './router'
import ReactDOM from 'react-dom/client'
axios.defaults.withCredentials = true
axios.defaults.headers.common['vxkey'] = import.meta.env.VITE_ACCESS_KEY

import "react-lazy-load-image-component/src/effects/blur.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "./root.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
)
