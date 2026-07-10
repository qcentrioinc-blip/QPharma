import { useParams } from "react-router-dom";


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
    <div className="w-full">
      <OrganicLanding variant={variant} />

      <OrganicItemList />
      <DigitalPharmacy variant={variant} />
<Ingredient variant={variant} />
  <Table variant={variant} />
  <TwoCard/>

   
    </div>
  );
};

export default Organic;