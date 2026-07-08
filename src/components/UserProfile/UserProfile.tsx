import { FiArrowRight } from "react-icons/fi";
import ContactNav from "../../Global/ContactNav";
import Footer from "../../Global/Footer";

const UserProfile = () => {
  return (
    <>
     <ContactNav />
    <div className="w-full bg-gray-100 py-6 ">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="w-full lg:w-[280px] bg-[#FAFAFA] rounded-xl p-5 border border-gray-100">
            <div className="flex flex-col items-center lg:items-start">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="profile"
                className="w-full h-full rounded-lg object-cover"
              />

              <h2 className="mt-4 text-xl  my-6 font-semibold text-gray-800">
                Mark Cole
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                swoo@gmail.com
              </p>
            </div>

            {/* Menu */}
            <div className="mt-6 space-y-3">
              <button className="group flex w-full items-center justify-between rounded-lg bg-[#547A3D] px-4 py-6 text-sm font-medium text-white transition-all duration-300 hover:bg-[#456632] hover:shadow-lg">
                <span>Account Info</span>
               <FiArrowRight className="shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <button className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:shadow-sm">
                <span>My Order</span>
               <FiArrowRight className="shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <button className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:shadow-sm">
                <span>My Address</span>
               <FiArrowRight className="shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <button className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:shadow-sm">
                <span>Change Password</span>
               <FiArrowRight className="shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Account Info
            </h1>

            <form className="space-y-5">
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Mark"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Cole"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  placeholder="swoo@gmail.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                  <span className="text-gray-400 text-xs ml-1">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="+1 0231 4554 452"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Save Button */}
              <div>
                <button
                  type="submit"
                  className="rounded-full bg-[#547A3D] px-10 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-[#456632] hover:shadow-lg"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default UserProfile;