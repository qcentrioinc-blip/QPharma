type Props = {
  variant: "organic" | "herbal" | "nutraceutical";
};

const DigitalPharmacy = ({ variant }: Props) => {
  const imageMap = {
    organic: "/DigitalPharmacy.png",
    herbal: "/Global/OrganicDigital.png",
    nutraceutical:"/Global/NutraDigital.png",
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto">
      <img
        src={imageMap[variant]}
        alt={`${variant} digital pharmacy`}
        className="w-full object-cover"
      />
    </div>
  );
};

export default DigitalPharmacy;