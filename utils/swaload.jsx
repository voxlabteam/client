import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
const lenghtData = Array.from({ length: 5 }, () => ({}))

const Swaload = {
    Product : () => {
        return lenghtData.map((i, index) => {
            return(
            <div className='product-card' key={index}>
                <Skeleton style={{boxShadow: 'var(--softshadow)'}} className='product-img' baseColor='var(--primary)' highlightColor='var(--prime)'/>
                <div className='wrapped-text'>
                    <Skeleton  style={{boxShadow: 'var(--softshadow)', marginLeft: '0'}} className='product-title' count={2} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                    <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                        <Skeleton style={{boxShadow: 'var(--softshadow)'}} width={95} height={30} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                        <Skeleton style={{boxShadow: 'var(--softshadow)'}} width={95} height={30} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                    </div>
                    <div className='wrapped-details'>
                        <Skeleton className='button price' style={{ backgroundColor: 'unset' }} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                    </div>
                </div>
            </div>
            )
        } )
    },

    Transaction : () => {
        return lenghtData.map((i, index) => {
            return (
                <div className="box-history">
                    <Skeleton style={{boxShadow: 'var(--softshadow)'}} className='itext' count={2} width={250} height={25} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                    <Skeleton style={{boxShadow: 'var(--softshadow)', position: 'absolute', bottom: '10px', left: '15px'}} width={200} height={25} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                </div>
            )
        })
    }
}

export default Swaload