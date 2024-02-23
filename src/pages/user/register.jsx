import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from "../../../utils/loading"
import swalert from '../../../utils/swalert'
import getvxsrf from '../../../service/getvxsrf'
import axios from "axios"
import "../../style/login.css"


const Register = () => {

    const navigate = useNavigate()

    const [vxsrf, setVxsrf] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const createUser = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API}/register`,
            {email, username, password}, {headers: { "xsrf-token" : vxsrf }})
            localStorage.setItem('register_mode_user', JSON.stringify({ email, username, password }))
            swalert(response.data, "success", 7000)
            .then((res) => {if (res.dismiss) {location.href = '/confirm/user'}})
        } 
        catch (error) {
            swalert(error.response.data, "error", 5000)
        }
        finally {setLoading(false)}
    }

    useEffect(() => { getvxsrf().then((result) => setVxsrf(result)) }, [])
    if (loading) return <Loading/>

    return (
        <div className="page">
            <div className="back" onClick={() => navigate('/')}>
                <div className="fa-solid fa-arrow-left fa-xl active"></div>
                <div className="nav-logo">
                    <p style={{fontFamily : "var(--caveat)"}}>Vixcera</p>
                </div>
            </div>
            <div className="login-box">
                <div className="login-top">
                    <div className="title"><span>Regis</span>ter</div>
                    <p className="desc">Free assets to make your <span>work easier.</span></p>
                </div>
                <form onSubmit={createUser} className="login-input">
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="text" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <div className="login-button">
                        <button type="submit" className="button" style={{fontFamily : "serif", width : "150px"}}>Create</button>
                        <NavLink to="/login" style={{textDecoration : "none", color : "var(--text)"}}>Have an account</NavLink>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register