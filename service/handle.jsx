import Topback from "../src/components/topback"
import { LazyLoadImage } from "react-lazy-load-image-component";

const Handle = ({ status }) => {
    return(
        <div className="page" style={{flexDirection: 'column', gap: '30px'}}>
            <Topback/>
            {(status == 404) ? (
                <LazyLoadImage src="/img/404page.png" style={{width: '220px'}} effect="blur" loading="lazy"/>
            ) : (
                <LazyLoadImage src="/img/500.png" style={{width: '310px'}} effect="blur" loading="lazy"/>
            )}
        </div>
    )
}

export default Handle;