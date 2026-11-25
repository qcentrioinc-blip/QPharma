import FormulaCatalog from "../components/FormulaCatalog";
import { theme, categories } from "./data";

export default function BioceuticalCatalog() {
  return (
    <FormulaCatalog
      theme={theme}
      categories={categories}
      rangeId="bioceutical"
      scrollClassName="zephyr-scroll-bio"
    />
  );
}

