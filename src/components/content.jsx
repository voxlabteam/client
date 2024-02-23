import { LazyLoadImage } from "react-lazy-load-image-component"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import products from "../../data/product"
import swalert from "../../utils/swalert"
import Context from "../../utils/context"
import vixcera from "../../data/vixcera"
import about from "../../data/about"
import axios from "axios"
import "../style/content.css"

const Content = ({data, setData, setCount}) => {

    const path = location.pathname
    const navigate = useNavigate()
    const context = useContext(Context)

    const deleteNotification = async (id) => {
        try {
            context.setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/delete/${id}`)
            setData((prev) => {
                const update = prev.filter((data) => data.order_id !== id)
                setCount(update.length)
                return update
            })
            swalert(response.data, "success", 1200)
        } catch (error) {
            if (error || error.response) {
                swalert(error.response.data, "error", 1200)
            }
        } finally {
            context.setLoading(false)
        }
            
    }

    return (
        <div className="content">
            <div className="snap-container"></div>
            <div className="grep"/>
            <div className="notification-panel">
                {(!data.length) ? 
                    <div className="notification-wrap" style={{ justifyContent: 'center', height: '100%'}}>
                        <div>No recent notification.</div>
                    </div>
                :
                    <div className="notification-wrap" style={{ justifyContent: 'unset' }}>
                        {data.map((i, k) => {
                            return (
                                <div className="notification-box" key={k}>
                                    <LazyLoadImage src="/img/vixcera.png" className="nimg" style={{width: '30px'}} loading="lazy" effect="blur"/>
                                    <div onClick={() => navigate(`/transaction/success/${i.order_id}`)} className="text-container" style={{ padding: '0', margin: '0', gap: '4px', width: '90%', cursor: 'pointer' }}>
                                        <div className="text">{i.transaction_status == "settlement" ? 'success' : i.transaction_status} transaction</div>
                                        <p style={{ fontSize: '0.8rem' }}><span style={{fontFamily: 'var(--poppins)'}}>Order ID : {i.order_id}</span></p>
                                    </div>
                                    <div className="close" onClick={() => deleteNotification(i.order_id)}>
                                        <div className="fa-solid fa-close fa-xl" style={{color: 'var(--second)'}}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            {(path == '/') && 
            <div>
                {(context.token) ? 
                <div className="developer">
                    <img src="/img/greeti.png" className="dimasputra" alt="" />
                    <div className="text-wrapper">
                    <div>Hi {context.username}!,</div>
                    <div>Welcome back.</div>
                    <div className="button contact" onClick={() => navigate('/profile')}>Account</div>
                </div>
                </div>
                : 
                <div className="developer">
                    <img src="/img/greeti.png" className="dimasputra" alt="" />
                    <div className="text-wrapper">
                    <h1>Welcome to Vixcera</h1>
                    <div>Let's explore with us.</div>
                    <div className="button contact" onClick={() => navigate('/register')}>Sign up</div>
                    </div>
                </div>}
                {(vixcera.map((i,k) => {
                return(
                    <div className="service" style={{paddingTop: "40px"}} key={k}>
                        <div className="itext"><span>{i.ctg}</span> Vixcera</div>
                        {i.data.map((p, l) => 
                            <div className="sbox" key={l} onClick={() => {p.ctg && navigate(`/product/${p.ctg}`)}} style={{borderRight : `2px solid ${p.color}`}}>
                                <div className="image-container" style={{backgroundColor : `${p.color}`}}>
                                    {p.img && <LazyLoadImage src={p.img} className="simg" style={{width: '60px'}} loading="lazy" effect="blur"/>}
                                </div>
                                <div className="text-container">
                                    <h3>{p.title}</h3>
                                    <p>{p.text}</p>
                                    <div className="wrapdet">{p.pricing && p.pricing.map((s, l) => {return(<div key={l}>{s}</div>)})}</div>
                                </div>
                            </div>
                        )}
                    </div>)
                }))}
            </div>
            }
            {(path == '/about') &&
            <div>
                {(about.map((i,k) => {
                return(
                    <div className="service" style={{paddingTop: '20px'}} key={k}>
                        <div className="itext"><span>{i.ctg}</span> Vixcera</div>
                        {i.data.map((p, l) => 
                            <div className="sbox" key={l} style={{borderRight : `2px solid ${p.color}`}}>
                                <div className="image-container" style={{backgroundColor : `${p.color}`}}>
                                    {p.img && <LazyLoadImage src={p.img} className="simg" style={{width: '50px'}} loading="lazy" effect="blur"/>}
                                </div>
                                <div className="text-container">
                                    <h3>{p.title}</h3>
                                    <p>{p.text}</p>
                                    <div className="wrapdet">{p.pricing && p.pricing.map((s, l) => {return(<div key={l}>{s}</div>)})}</div>
                                </div>
                            </div>
                        )}
                    </div>)
            }))}
            {/* <div className="developer">
                <img src="/img/dimasputra.png" alt="" className="dimasputra"/> 
                <div className="text-wrapper">
                <div>Vixcera Developer</div>
                <div>Dimas Putra Utama</div>
                <div className="button contact" onClick={() => navigate('/dashboard')}>Contact</div>
                </div>
            </div> */}
            </div>
            }
            {(path == '/products') && 
            <div>
                <div className="developer">
                <img src="/img/cont.png" alt="" className="dimasputra"/> 
                <div className="text-wrapper">
                <h1>Become a contributor</h1>
                <div>Sell your best work</div>
                <div className="button contact">Upcoming</div>
                </div>
                </div>
                {(products.map((i,k) => {
                    return(
                        <div className="service" style={{paddingTop: "40px"}} key={k}>
                            <div className="itext"><span>{i.ctg && i.ctg}</span> Categories</div>
                            {i.data.map((p, l) => 
                                <div className="sbox" key={l} onClick={() => navigate(`/product/${p.ctg}`)}  style={{borderRight : `2px solid ${p.color}`}}>
                                    <div className="image-container" style={{backgroundColor : `${p.color}`}}>
                                        {p.img && <LazyLoadImage src={p.img} className="simg" loading="lazy" effect="blur"/>}
                                    </div>
                                    <div className="text-container">
                                        <h3>{p.title}</h3>
                                        <p>{p.text}</p>
                                        <div className="wrapdet">{p.pricing && p.pricing.map((s, l) => {return(<div key={l}>{s}</div>)})}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }))}
            </div>
            }
            <p style={{textAlign: 'center', color: 'var(--text)', fontSize: '0.8rem', marginTop: '20px', fontFamily: 'var(--quicksand)'}}>Copyright © 2024 Vixcera, Xera platform.</p>
        </div>
    )
}

export default Content