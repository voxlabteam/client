import React, { useContext } from 'react'
import axios from 'axios'
import snap from "../../../utils/snap"
import swalert from '../../../utils/swalert'
import Loading from "../../../utils/loading"
import convertPrice from '../../../utils/price'
import getvxsrf from '../../../service/getvxsrf'
import Context from "../../../utils/context"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import "../../style/create.css"

const Order = () => {

    const context = useContext(Context)
    const location = useLocation()
    const history = JSON.parse(localStorage.getItem("inputOrder"))
    const navigate = useNavigate()
    const {vid} = useParams()
    const i = location.state
    
    const [loading, setLoading] = useState('')
    const [vxsrf, setVxsrf] = useState('')
    const [data, setData] = useState(i)
    const [name, setName] = useState(context.username ? context.username : '')
    const [email, setEmail] = useState(context.email ? context.email : '')
    const [phone, setPhone] = useState(history ? history.phone : '')
    
    if (name || email || phone) {
      localStorage.setItem('inputOrder', JSON.stringify({ name, email, phone }))
    }
    
    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/vid/${vid}`)
            setData(response.data)
        }   catch (error) {
            if (error || error.response) {
              swalert(error.response.data, "error", 1500)
              .then((res) => res.dismiss && navigate('/'))
            }
        } finally {
          setLoading(false)
        }
    }

    const showPlaceOrder = async () => {
      if (email && phone && name) {
        return Swal.fire({
          html: `
          <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
            <h2 style="text-align: center;">Shipping Details</h2>
            <div style="width: 100%; height: 1px; background-color: var(--blue);"></div>
            <h4 style="margin-top: 5px; text-align: left;"><span>Customer</span> : ${name}</h4>
            <h4 style="text-align: left;"><span>Phone Number</span> : ${phone}</h4>
            <h4 style="text-align: left;"><span>Email Address</span> : ${email}</h4>
            <h4 style="text-align: left;"><span>Product ID</span> : ${vid}</h4>
            <h4 style="text-align: left;"><span>Quantity</span> : 1</h4>
            <h4 style="text-align: left;"><span>Price</span> : ${convertPrice(i.price)}</h4>
            <h4 style="text-align: left;"><span>PPN</span> : 11%</h4>
            <div style="width: 100%; height: 1px; background-color: var(--blue)"></div>
            <h4><span>Total Amount</span> : ${convertPrice(i.price * 0.11 + i.price)}</h4>
          </div>  
          `,
          confirmButtonText: 'Confirm & Pay',
          cancelButtonText: "Cancel",
          reverseButtons : true,
          allowOutsideClick: false,
          showCancelButton: true,
          focusConfirm: false,
          color: 'var(--blue)',
          background: 'var(--primary)',
          customClass: {container: 'alertext'},
        })
        .then((res) => {
          if (res.isConfirmed) {
            checkout()
          }
        })
      }
    }
    
    const checkout = async () => {
      try {
        setLoading(true)
        const response = await axios.post(`${import.meta.env.VITE_API}/transaction/create`,{
          vid     : vid,
          name    : name,
          email   : email,
          phone   : phone,
        }, 
        { headers : { "xsrf-token" : vxsrf } })
        localStorage.setItem('transaction_mode', "true")
        window.snap.pay(response.data, {
          onSuccess: (result) => { window.location.href = `/transaction/success/${result.order_id}`},
          onPending : () => {window.location.href = '/'}
      })
      } 
      catch (error) {
        if (error || error.response) {
          swalert(error.response.data, "error")
        }
      }
      finally { setLoading(false) }
    }

    const getWarning = () => {
      if (!context.token) {
        swalert('please login first before starting the transaction', 'info', 3000)
      }
    }

    useEffect(() => {
      if (!i) { getProducts() }
      snap()
      getvxsrf().then((result) => setVxsrf(result))
    }, [])

    useEffect(() => {
      context.username && setName(context.username)
      context.email && setEmail(context.email)
    }, [context])

    if (loading) return <Loading/>

    return (
        <div className='page-max' style={{gap:'30px'}}>
          <div className="back" onClick={() => navigate(`/product/details/${vid}`, { state: i })}>
            <div className="fa-solid fa-arrow-left fa-xl active"></div>
            <div className="nav-logo" style={{fontFamily: 'var(--caveat)'}}>Vixcera</div>
            <div className='snap-container'></div>
          </div>
          <div className='form'>
            <div className='input-form' >
              <div>
                <div>Name :</div>
                <input className='productinput' onClick={() => getWarning()} value={name} type="text" placeholder='input your name' onChange={(e) => setName(e.target.value)} readOnly required/>
              </div>
              <div>
                <div>Phone Number :</div>
                <input className='productinput' value={phone} type="text" placeholder='input your phone number' onChange={(e) => setPhone(e.target.value)} required/>
              </div>
              <div>
                <div>Email :</div>
                <input className='productinput' onClick={() => getWarning()} value={email} type="email" placeholder='input your email' onChange={(e) => setEmail(e.target.value)} readOnly required/>
              </div>
              <div className='button-max' onClick={() => context.token ? showPlaceOrder() : getWarning()} style={(name && phone && email) ? { backgroundColor: 'var(--yellow)' } : { backgroundColor: "#aaa" }}>Checkout</div>
            </div>
            <div className='prev-form'>
              <div className='itext'>Product</div>
              <div className='product-card'>
                <LazyLoadImage className='product-img' src={data.img} loading='lazy' effect='blur'/>
                <div className='wrapped-text'>
                    <div className='product-title'>{data.title}</div>
                    <div className='product-desc'>{data.desc}</div>
                    <div className='wrapped-details'>
                        <div className='button price'>{convertPrice(data.price)}</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}

export default Order