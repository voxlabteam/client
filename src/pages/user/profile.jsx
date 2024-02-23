import { useContext, useRef, useState, useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router-dom'
import getvxsrf from '../../../service/getvxsrf'
import Context from '../../../utils/context'
import Loading from "../../../utils/loading"
import swalert from '../../../utils/swalert'
import axios from "axios"

const Profile = () => {

    const navigate = useNavigate()
    const inputref = useRef(null)
    const context = useContext(Context)
    const url = import.meta.env.VITE_API

    const [file, setFile] = useState(null)
    const [email, setEmail] = useState('')
    const [vxsrf, setVxsrf] = useState('')
    const [loading, setLoading] = useState(false)

    const logout = async() => {
        const filterUrl = context.status == 'contributor' ? `${url}/logout/contributor` : `${url}/logout`
        try {
            setLoading(true)
            const response = await axios.get(filterUrl)
            context.setToken('')
            swalert(response.data, "success", 1500)
            .then((res) =>  { if(res.dismiss) { location.href = '/' } })
        } 
        catch (error) {{error.response && console.log(error.response.data)}}
        finally{setLoading(false)}
    }

    const updateImage = async(e) => {
        e.preventDefault()
        setLoading(true)
        const filterUrl = context.status == 'contributor' ? `${url}/contributor/update` : `${url}/user/update`
        let formData = new FormData();
        formData.append('img', file);
        try {
            const response = await axios.put(filterUrl, formData, {
                headers : {"Content-Type" : "multipart/form-data", "xsrf-token" : vxsrf}, 
                withCredentials : true
            })
           ;(await swalert(response.data, "success")).dismiss && location.reload()
        } 
        catch (error) {
            if (error || error.response) {
                swalert(error.response.data, "error", 1500)
            }
        }
        finally {setLoading(false)}
    }

    useEffect(() => { getvxsrf().then((result) => setVxsrf(result)) }, [])
    if (loading) return <Loading/>

    return (
        <div className='page' style={{flexDirection: 'column', gap : '10px'}}>
            <div className="back" onClick={() => navigate('/')}>
                <div className="fa-solid fa-arrow-left fa-xl active"></div>
                <div className="nav-logo"><p style={{fontFamily : "var(--caveat)"}}>Vixcera</p></div>
            </div>
            <LazyLoadImage onClick={() => inputref.current.click()} src={(file) ? URL.createObjectURL(file) : context.img} width={150} height={150} style={{borderRadius : '50%', objectFit: 'cover', cursor : 'pointer', border : '2px solid var(--yellow)'}}/>
            <div className='title'>{context.username}</div>
            <form style={{display: 'flex', alignItems: "center", flexDirection: 'column'}} onSubmit={updateImage}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={inputref} style={{display: 'none'}}/>
                <input id='changemail' type="text" style={{width : '300px'}} placeholder={context.email} readOnly/>
                {(file || email) ? <button style={{margin: '30px 0'}} className='button' type='submit'>update</button> : 
                <div style={{margin: '30px 0', display: 'flex', gap: '20px'}}>
                    {(context.status == 'contributor') ? 
                        <div className='button'><i style={{cursor: 'pointer'}} className='fa-solid fa-store fa-xl'/></div>
                        :
                        <div className='button' onClick={() => navigate('/transaction/history')}><i style={{cursor: 'pointer'}} className='fa-solid fa-money-bill-transfer fa-xl'/></div>
                    }
                    <div className='button' onClick={logout}><i className='fa-solid fa-right-from-bracket fa-xl'/></div>
                </div>}  
            </form>
        </div>
    )
}

export default Profile;