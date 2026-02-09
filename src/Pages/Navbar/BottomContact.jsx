import React from "react";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

const BottomContact = () => {
  return (
    <section className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-[rgba(148,163,184,0.1)] rounded-xl p-8 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-500 p-3 rounded-full">
            <PhoneIcon className="h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Call Us</h3>
        </div>

        <p className="text-gray-600">+92 234 5678990</p>
        <p className="text-gray-600">+92 234 5678990</p>
      </div>

      <div className="bg-[rgba(148,163,184,0.1)] rounded-xl p-8 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-500 p-3 rounded-full">
            <EnvelopeIcon className="h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Email</h3>
        </div>

        <p className="text-gray-600">fastbite891@gmail.com</p>
        <p className="text-gray-600">samihamumtaz891@gmail.com</p>
      </div>

      <div className="bg-[rgba(148,163,184,0.1)] rounded-xl p-8 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-500 p-3 rounded-full">
            <MapPinIcon className="h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Address</h3>
        </div>

        <p className="text-gray-600">
          37125 Maya Estate Dr, Wahdat Road,
        </p>
        <p className="text-gray-600">
          Lahore
        </p>
      </div>
    </section>
  )
}

export default BottomContact