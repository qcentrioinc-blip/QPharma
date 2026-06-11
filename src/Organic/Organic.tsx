import Footer from "../Global/Footer";
import Navbar from "../Global/Navbar";
import DigitalPharmacy from "./DigitalPharmacy";
import Ingredient from "./Ingredient";
import OrganicItemList from "./OrganicItemList";
import OrganicLanding from "./OrganicLanding";
import Table from "./Table";
import TwoCard from "./TwoCard";

const Organic = () => {
    return (
        <div>
            <Navbar/>
            <OrganicLanding />
            <OrganicItemList />
            <DigitalPharmacy />
            <Ingredient />
            <Table />
            <TwoCard />
            <Footer />
        </div>
    );
};

export default Organic;