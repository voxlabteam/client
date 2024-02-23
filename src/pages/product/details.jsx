import moment from "moment"
import Skeleton from "react-loading-skeleton"
import convertPrice from "../../../utils/price"
import { useLocation, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useEffect, useState } from "react"
import axios from "axios"
import "../../style/create.css"

const Details = () => {

    const { vid } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [cont, setCont] = useState('')
    const [i, seti] = useState(location.state)
    const [loading, setLoading] = useState(false)
    const date = moment(i.createdAt.slice(0, 10)).format('MMM DD, YYYY')

    const getContributor = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/product/by/${i.by}`)
            setCont(response.data)
        } catch (error) {
            return Promise.reject(error)
        } finally {
            setLoading(false)
        }
    }

    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/vid/${vid}`)
            seti(response.data)
        }   catch (error) {
            if (error || error.response) {
              swalert(error.response.data, "error", 1500)
              .then((res) => res.dismiss && navigate('/'))
            }
        } finally {
          setLoading(false)
        }
    }

    useEffect(() => { 
        i.by && getContributor() 
        !i && getProducts()
    }, [])

    return (
        <div className='page-max'>
            <div className="back" onClick={() => navigate(`/product/${i.ctg}`)}>
                <div className="fa-solid fa-arrow-left fa-xl active"></div>
                <div className="nav-logo" style={{fontFamily: 'var(--caveat)'}}>Vixcera</div>
            </div>
            <div className="form">
                <div className='prev-form' style={{ marginTop: '10px', paddingBottom: '0', gap: '20px' }}>
                    <div className='itext'>Product Details</div>
                        <>
                        <div className="product-card" style={{ height: 'max-content', width: '100%', marginTop: '0px', justifyContent: 'center' }}>
                            <LazyLoadImage style={{ width: '100%' }} className='product-img' src={i.img} loading='lazy' effect='blur'/>
                        </div>
                        <div className="button-max" style={{ color: "var(--text)", backgroundColor: "var(--primary)"}} onClick={() => window.open(i.link)}>
                            <div className="i fa-solid fa-globe fa-xl"/>
                            Live Preview
                        </div>
                        <div className='product-card' style={{ height: 'max-content', width: '100%', marginTop: "30px" }}>
                            <div className='wrapped-text'>
                                <div className='product-title' style={{ fontSize: '1.4rem' }}>{i.title}</div>
                                <div className='product-desc' style={{ display: "block", fontSize: '1rem', marginTop: '10px', fontFamily: 'var(--quicksand)', color: 'var(--blue)' }}>{i.desc}</div>
                            </div>
                        </div>
                        <div className='product-card' style={{ height: 'max-content', width: '100%', marginTop: '10px' }}>
                            <div className='wrapped-text'>
                                <div className='wrapped-details' style={{margin: 0, paddingTop: '0', display: 'flex',alignItems: 'unset', flexDirection: "column", gap: '10px'}}>
                                    <div className="product-desc-product"><span>VID</span>          : {i.vid}</div>
                                    <div className="product-desc-product"><span>Price</span>        : {convertPrice(i.price)}</div>
                                    <div className="product-desc-product"><span>Category</span>     : {i.ctg}</div>
                                    {i.ctg == 'web' && <div className="product-desc-product"><span>Framework</span>  : {i.tech} {i.tech.toLowerCase().includes('html') ? "" : 'JS'}</div>}
                                    <div className="product-desc-product"><span>Date created</span>  : {date}</div>
                                </div>
                            </div>
                        </div>
                        <div className='product-card' style={{ height: 'max-content', width: '100%' }}>
                            <div className='wrapped-text'>
                                <div className='wrapped-details' style={{margin: 0, paddingTop: '0', display: 'flex',alignItems: 'unset', flexDirection: "column", gap: '10px'}}>
                                    <div className="product-desc-product">
                                        <span>Contributor : </span>
                                        {(loading) ? 
                                            <div style={{marginTop: '10px',display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                <Skeleton style={{boxShadow: 'var(--softshadow)', width: '30px', height: '30px', borderRadius: '50%'}} baseColor='var(--primary)' highlightColor='var(--prime)'/> 
                                                <Skeleton style={{boxShadow: 'var(--softshadow)'}} className='itext' width={150} height={30} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                                            </div>
                                        : 
                                            <div style={{marginTop: '10px',display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                <LazyLoadImage src={cont.img ? cont.img : '/img/dui.jpg'} style={{width: '30px', height: '30px', objectFit: 'cover', borderRadius: '50%'}}/>
                                                <p style={{color: 'var(--blue)'}}>{cont.username && cont.username}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-max" onClick={() => navigate(`/order/${vid}`, {state: i})} style={{ marginTop: '30px', backgroundColor: 'var(--yellow)' }}>
                            <div className="i fa-solid fa-cart-shopping fa-xl" style={{color: 'var(--background)'}}/>
                            Order now
                        </div>
                        </>
                </div>
            </div>
        </div>
    )
}

export default Details