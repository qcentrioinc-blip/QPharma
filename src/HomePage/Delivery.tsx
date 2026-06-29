
import DeliveryImage from '/Global/Delivery.png'

const Delivery = () => {
  return (
    <section className="max-w-7xl mx-auto py-6 px-4 md:px-8 lg:px-12">
      <img
        src={DeliveryImage}
        alt="Delivery Banner"
        className="w-full h-auto object-contain rounded-xl md:rounded-2xl"
      />
    </section>
  )
}

export default Delivery