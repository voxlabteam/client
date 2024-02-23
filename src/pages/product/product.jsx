import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import convertPrice from "../../../utils/price"
import Handle from "../../../service/handle"
import Swaload from '../../../utils/swaload'
import axios from "axios"
import "../../style/product.css"

const Product = () => {
    const navigate = useNavigate()
    const { ctg } = useParams()
    const [ data, setData ] = useState([])
    const [ status, setStatus ] = useState(200)
    const [ loading, setLoading ] = useState(false)
    const [ page, setPage ] = useState(1)
    
    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/${ctg}/${page}`)
            !response.data.length && setStatus(404)
            setData(response.data)
        }   catch (error) {
            setStatus(error.response ? 404 : 500)
        }
        finally { setLoading(false) }
    }

    useEffect(() => { getProducts() }, [page])
    if (status !== 200) return <Handle status={status}/> 

    return (
        <div className='page-max'>
            <div id='snap-container'></div>
                <div className="back" onClick={() => navigate('/products')}>
                    <div className="fa-solid fa-arrow-left fa-xl active"></div>
                    <div className="nav-logo" style={{fontFamily: 'var(--caveat)'}}>Vixcera</div>
                </div>
            <div className='product-page'>
                <div className='product-container' style={{flexDirection: 'column-reverse'}}>
                    <input type="text" className='search'/>
                    {(loading) ? (
                    <Swaload.Product/>
                    ) : (
                        data.map((i, index) => {
                            return(
                                <div className='product-card' key={index} onClick={() => navigate(`/product/details/${i.vid}`, {state: i})}>
                                    <LazyLoadImage className='product-img' src={(i.img) || ('img/img404.jpg')} loading='lazy' effect='blur'/>
                                    <div className='wrapped-text'>
                                        <div className='product-title'>{i.title}</div>
                                        <div style={{ display: 'flex', flexWrap : 'wrap', flexDirection : 'column'}}>
                                            <div className='product-desc'>{i.desc.length >= 40 ? i.desc.substring(0,40) + '...' : i.desc}</div>
                                            <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px' }}>{i.tech}</div>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px' }}>{i.tech.toLowerCase().includes('html') ? "only" : 'JS'}</div>
                                             </div>
                                        </div>
                                        <div className='wrapped-details'>
                                            <div className='button price'>{convertPrice(i.price)}</div>
                                            <div style={{ color : 'var(--text)', cursor: 'pointer'}} className='fa-solid fa-cart-plus fa-xl' />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                {(data.length >= 10) ? 
                    <div style={{ display: 'flex', gap: '20px', marginTop: '50px', alignItems: 'center', justifyContent: 'center' }}>
                        {(page !== 1) && <div className='button' onClick={() => setPage(page -1)} style={{borderRadius: '10px'}}><div className='fa-solid fa-left-long fa-xl'/></div>}
                        <div className='button' onClick={() => setPage(page +1)} style={{borderRadius: '10px'}}><div className='fa-solid fa-right-long fa-xl'/></div>
                    </div>
                :
                    <div style={{ display: 'flex', gap: '20px', marginTop: '50px', alignItems: 'center', justifyContent: 'center' }}>
                        <div className='desc' style={{fontFamily: 'var(--mono)',fontSize: '0.9rem', color: 'var(--text)'}}>already displays all products</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Product