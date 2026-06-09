import ContactNav from "../../Global/ContactNav"
import Herosection from "./Herosection"
import Payment from "./Payment"
import ProductHighlights from "./ProductHighlights"
import RecentBought from "./RecentBought"

const ProductDetail = () => {
  return (
    <div> 
      <ContactNav/>
        <Herosection/>  
        <RecentBought/>
        <ProductHighlights/>
        <Payment/>  
    </div>
  )
}
export default ProductDetail  