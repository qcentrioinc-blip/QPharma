import { useState } from "react";
import Product from "./Product";
import Explore from "../HomePage/Explore";
import ProductList from "./ProductList";
import ProductExplore from "./ProductExplore";
// import Natural from "../AboutUS/Natural";
import Footer from "../Global/Footer";
import Navbar from "../Global/Navbar";

const ProductPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div>
            <Navbar />
            <Product searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <Explore />
            <ProductList searchQuery={searchQuery} />
            <ProductExplore />
            {/* <Natural /> */}
            <Footer />
        </div>
    );
};

export default ProductPage;