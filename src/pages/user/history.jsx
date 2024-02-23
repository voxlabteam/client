import { useEffect, useState } from "react"
import axios from "axios"
import convertPrice from "../../../utils/price"
import Topback from "../../components/topback"
import swalert from "../../../utils/swalert"
import "../../style/history.css"
import { useLocation, useNavigate } from "react-router-dom"
import Swaload from "../../../utils/swaload"

const History = () => {

    const navigate = useNavigate()
    const [total, setTotal] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/history`)
            if (response.data.length !== 0) {
                setData(response.data)
                let plus = 0
                response.data.forEach(index => {
                    plus += index.product_amount
                })
                setTotal(plus)
            }
        } catch (error) {
            if (error || error.response) {
                swalert(error.response.data || "Forbidden request", 'error', 2000)
            }
        } finally {setLoading(false)}
    }

    useEffect(() => {getData()}, [])

    return (
        <div className="page-max">
            <Topback/>
            <div className="form" style={{marginTop: '70px'}}>
                <div className="input-form" style={{marginTop: '40px', flexDirection: 'column-reverse'}}>
                    {loading ? (<Swaload.Transaction/>) : 
                        data.length !== 0 && data.map((i, k) => {
                            return (
                            <div className="box-history" key={k} onClick={() => navigate(`/transaction/success/${i.order_id}`, {state: i})}>
                                <div className="itext" style={{color: 'var(--yellow)'}}>{convertPrice(i.product_amount)}</div>
                                <div className="itext" style={{fontFamily: 'var(--quicksand)', fontSize: '1.1rem', translate: '0 -5px'}}> <span>Order ID</span> : {i.order_id}</div>
                                <div className= "badge" style={{position: 'absolute', bottom: '0', left: '15px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                    <div className="fa-solid fa-circle-check fa-lg" style={{color: 'var(--blue)'}}/>
                                    <div className="desc" style={{color: 'var(--blue)'}}>Verified Transaction</div>
                                </div>
                            </div>
                            )
                        })
                    }
                </div>
                <div style={{fontSize: '1.1rem', fontFamily: 'var(--quicksand)', color: 'var(--blue)', textAlign: 'center'}}>Total of all expenses : {convertPrice(total)}</div>
                <div className="title" style={{textAlign: 'center'}}><span>Order</span> History</div>
            </div>
        </div>
    )
}

export default History