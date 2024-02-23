import axios from "axios"
import bowser from "bowser"
import swal from "sweetalert2"

const checkvxsrf = async () => {

    const agent = sessionStorage.getItem("agent")
    const info = bowser.parse(window.navigator.userAgent)
    const name = info.browser.name.toLowerCase()

    const img_safari = '/img/safari.png'
    const img_chrome = '/img/chrome.png'
    const img_firefox = '/img/firefox.png'
    const img_default = '/img/browser.png'

    const endpoint = (name === 'safari') && 'https://support.apple.com/en-gb/guide/iphone/iphb01fc3c85/ios#:~:text=Control%20privacy%20and%20security%20settings,to%20allow%20cross%2Dsite%20tracking.' ||
                     (name === 'chrome') && 'https://support.google.com/accounts/answer/61416?hl=id&co=GENIE.Platform%3DDesktop&oco=1' ||
                     (name === 'firefox') && 'https://www-internetcookies-com.translate.goog/enable-cookies-firefox/?_x_tr_sl=en&_x_tr_tl=id&_x_tr_hl=id&_x_tr_pto=tc' ||
                     (!name.includes("safari" || "chrome" || "firefox")) && 'https://www-123formbuilder-com.translate.goog/docs/how-to-enable-third-party-cookies-in-your-web-browser/?_x_tr_sl=en&_x_tr_tl=id&_x_tr_hl=id&_x_tr_pto=tc'

    const endimg = (name === 'safari') && img_safari ||
                   (name === 'chrome') && img_chrome ||
                   (name === 'firefox') && img_firefox ||
                   (!name.includes("safari" || "chrome" || "firefox")) && img_default

    if (!agent) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/checkvxsrf`)
            sessionStorage.setItem("agent", "prevent")
        } catch (error) {
            if (error.response){
                swal.fire({
                    icon : 'info',
                    title: 'cookie disabled',
                    text: 'vixcera requires third-party cookies, please enable on your browser settings.',
                    background: 'var(--primary)',
                    color : 'var(--blue)',
                    showDenyButton: true,
                    denyButtonText: 'dismiss',
                    confirmButtonText: "how's that?",
                    allowOutsideClick: false
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        swal.fire({
                            imageUrl: endimg,
                            imageWidth : 90,
                            background: 'var(--primary)',
                            color : 'var(--blue)',
                            title : name,
                            text : `we detected you are using ${name}, let's configure and start exploring vixcera.`,
                            confirmButtonText: "check it out",
                            allowOutsideClick: false
                        })
                        .then((res) => {
                            if (res.isConfirmed) return window.open(endpoint, "_blank")
                        })
                    }
                    if (result.isDenied) {
                        swal.fire({
                            icon: 'warning',
                            text : "some features may not work properly. or you can try on another browser.",
                            background: 'var(--primary)',
                            color : 'var(--blue)',
                            showDenyButton: true,
                            denyButtonText: "don't show again!",
                            confirmButtonText: "how's that?",
                            allowOutsideClick: false
                        })
                        .then((res) => {
                            if (res.isDenied) {
                                sessionStorage.setItem("agent", "prevent")
                            }
                            if (res.isConfirmed) {
                                swal.fire({
                                    imageUrl: endimg,
                                    imageWidth : 90,
                                    background: 'var(--primary)',
                                    color : 'var(--blue)',
                                    title : name,
                                    text : `we detected you are using ${name}, let's configure and start exploring vixcera.`,
                                    confirmButtonText: 'check it out',
                                    allowOutsideClick: false
                                })
                                .then((show) => {
                                    if (show.isConfirmed) return window.open(endpoint, "_blank")
                                })
                            }
                        })
                    }
                })
            }
        }
    }
}

export default checkvxsrf;