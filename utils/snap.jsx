const snap = () => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';  
        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
        scriptTag.setAttribute('data-client-key', import.meta.env.VITE_CLIENT_KEY_SANDBOX);
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        }

}

export default snap