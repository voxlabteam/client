import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from "react-lazy-load-image-component"
import convertPrice from '../../../utils/price'
import getvxsrf from "../../../service/getvxsrf"
import Loading from "../../../utils/loading"
import swalert from "../../../utils/swalert"
import axios from "axios"
import "../../style/create.css"

const Create = () => {
  const navigate = useNavigate()
  const fileref = useRef(null)
  const imgref = useRef(null)

  const inputHistory = JSON.parse(localStorage.getItem('inputHistory'))

  const [loading, setLoading] = useState(false)

  const [file, setFile] = useState('')
  const [vxsrf, setVxsrf] = useState('')
  const [image, setImage] = useState('')

  const [ctg, setCtg] = useState((inputHistory) ? inputHistory.ctg : '')
  const [tech, setTech] = useState((inputHistory) ? inputHistory.tech : '')
  const [desc, setDesc] = useState((inputHistory) ? inputHistory.desc : '')
  const [link, setLink] = useState((inputHistory) ? inputHistory.link : '')
  const [title, setTitle] = useState((inputHistory) ? inputHistory.title : '')
  const [price, setPrice] = useState((inputHistory) ? inputHistory.price : '')

  if (title || price || desc || ctg || file || image || link) {
    localStorage.setItem('inputHistory', JSON.stringify({title, price, desc, ctg, tech, link }))
  }

  const createProduct = async () => {
    
    if (file && title && image && desc && price && ctg && tech && link) {
      setLoading(true)
      try {
        let formData = new FormData()
        formData.append('ctg', ctg);
        formData.append('img', image);
        formData.append('desc', desc);
        formData.append('link', link);
        formData.append('file', file);
        formData.append('tech', tech);
        formData.append('title', title);
        formData.append('price', price);
        const response = await axios.post(`${import.meta.env.VITE_API}/product`,formData, {
          headers: {"Content-Type": 'multipart/form-data', "xsrf-token" : vxsrf}
        })
        localStorage.removeItem('inputHistory')
        swalert(response.data, "success", 5000)
        .then((res) => { if(res.dismiss) {location.href = '/'} })
      } catch (error) {
        swalert("server maintenance!", "error", 1500)
        if (error.response) { swalert(error.response.data, "error", 1500) }
      } finally { setLoading(false) }
    } else {
      swalert("please complete the form data!", "error", false)
    }
  }

  useEffect(() => { getvxsrf().then((data) => setVxsrf(data)) }, [])
  if (loading) return <Loading/>

  return (
    <div className='page-max' style={{gap:'30px', paddingBottom: '5px'}}>
      <div className="back" onClick={() => navigate('/')}>
        <div className="fa-solid fa-arrow-left fa-xl active"></div>
        <div className="nav-logo" style={{fontFamily: 'var(--caveat)'}}>Vixcera</div>
      </div>
      <div className='form'>
        <div className='input-form'>
          <div>
            <div>Title :</div>
            <input className='productinput' value={title} type="text" placeholder='e.g. company profile' onChange={(e) => setTitle(e.target.value)} required/>
          </div>
          <div>
            <div>Description :</div>
            <input className='productinput' value={desc} type="text" placeholder='e.g. modern company web.....' onChange={(e) => setDesc(e.target.value)} required/>
          </div>
          <div>
            <div>Price :</div>
            <input className='productinput' value={price} type="text" placeholder='e.g. 350000' onChange={(e) => setPrice(e.target.value)} required/>
          </div>
          <div>
              <div>Category :</div>
              <select style={{width: '100%', textAlign: 'center'}} value={ctg} onChange={(e) => setCtg(e.target.value)} required>
                <option value="" disabled hidden></option>
                <option value="web">Web</option>
                <option value="vector">Vector</option>
                <option value="video">Video</option>
              </select>
          </div>
          {(ctg == 'web') && 
          <>
            <div>
                <div>Framework :</div>
                <select style={{width: '100%'}} value={tech} onChange={(e) => setTech(e.target.value)} required>
                  <option value=""></option>
                  <option value="html & css">HTML & CSS</option>
                  <option value="Angular">Angular JS</option>
                  <option value="Svelte">Svelte JS</option>
                  <option value="React">React JS</option>
                  <option value="Next">Next JS</option>
                  <option value="Vue">Vue JS</option>
                </select>
            </div>
            <div>
              <div>Link Preview :</div>
              <input className='productinput' value={link} type="text" placeholder='e.g. https://my-website.com' onChange={(e) => setLink(e.target.value)} required/>
            </div>
          </>
          }
          
          <div className='wrap-file'>
            <div>
              <div>Image : </div>
              <div className='prevfile' onClick={() => imgref.current.click()}>
                <div className={(image) ? 'fa-solid fa-check fa-xl' : 'fa-solid fa-image fa-xl'} style={{color: '#aaa', fontSize: '2rem'}}/>
                <div style={{ color: '#aaa', fontSize: '0.7rem' }}>{'(JPEG, JPG, PNG, MP4)'}</div>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} ref={imgref} style={{display:'none'}}/>
                <div style={{ color: '#aaa', fontSize: '0.95rem' }}>Max size: 10 Mb</div>
              </div>
            </div>
            <div>
              <div>File : </div>
              <div className='prevfile' onClick={() => fileref.current.click()}>
                <div className={(file) ? 'fa-solid fa-check fa-xl' : 'fa-solid fa-file fa-xl'} style={{color: '#aaa', fontSize: '2rem'}}/>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileref} style={{display:'none'}}/>
                <div style={{ color: '#aaa', fontSize: '0.7rem' }}>{'(ZIP, RAR)'}</div>
                <div style={{ color: '#aaa', fontSize: '0.95rem' }}>Max size: 20 Mb</div>
              </div>
            </div>
            <div className='button-max' onClick={() => createProduct()} style={(file && title && image && desc && price && ctg && tech) ? {backgroundColor: 'var(--yellow)', marginTop: '50px'} : {backgroundColor: '#aaa', marginTop: '50px'}}>Create</div>
            </div>
          </div>
        <div className='prev-form'>
          <div className='itext'>Preview</div>
          <div className='product-card'>
            <LazyLoadImage className='product-img' src={(image) ? URL.createObjectURL(image) : '/img/dpi.jpg'} loading='lazy' effect='blur'/>
            <div className="wrapped-text">
              <div className='product-title'>{(title) ? title : 'Untitled'}</div>
              <div className='product-desc'>{(desc) ? (desc.length >= 30) ? desc.substring(0,30) + "..." : desc : 'no description available'}</div>
              <div className="wrapped-details">
              <div className='button price'>{convertPrice(price)}</div>
              <div style={{ color : 'var(--text)', cursor: 'pointer'}} className='fa-solid fa-cart-plus fa-xl' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Create