import { useParams } from "react-router-dom";

import Footer from "../Global/Footer";
import Navbar from "../Global/Navbar";

import OrganicLanding from "./OrganicLanding";
import OrganicItemList from "./OrganicItemList";

import DigitalPharmacy from "./DigitalPharmacy";
import Ingredient from "./Ingredient";
import Table from "./Table";
import TwoCard from "./TwoCard";


const Organic = () => {
  const { category } = useParams();

  const variant =
    category === "herbal"
      ? "herbal"
      : category === "nutraceutical"
      ? "nutraceutical"
      : "organic";

  return (
    <>
      <Navbar />

      <OrganicLanding variant={variant} />

      <OrganicItemList />
      <DigitalPharmacy variant={variant} />
<Ingredient variant={variant} />
  <Table variant={variant} />
  <TwoCard/>

      <Footer />
    </>
  );
};

export default Organic;