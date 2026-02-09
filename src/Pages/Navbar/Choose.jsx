import React from 'react'

const Choose = () => {
  return (
    <section className="w-full py-16 px-6 lg:px-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose FastBite?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 border border-[rgb(245,130,32)] rounded-xl shadow-sm hover:shadow-md transition text-center">
            <h3 className="text-xl font-semibold text-[rgb(245,130,32)] mb-3">Fast Delivery</h3>
            <p className="text-gray-600">
              Hot and fresh meals delivered in minimum time without delays.
            </p>
          </div>
          <div className="p-6 border border-[rgb(245,130,32)] rounded-xl shadow-sm hover:shadow-md transition text-center">
            <h3 className="text-xl font-semibold text-[rgb(245,130,32)] mb-3">Fresh Ingredients</h3>
            <p className="text-gray-600">
              We use high-quality ingredients to ensure rich taste and freshness.
            </p>
          </div>
          <div className="p-6 border border-[rgb(245,130,32)] rounded-xl shadow-sm hover:shadow-md transition text-center">
            <h3 className="text-xl font-semibold text-[rgb(245,130,32)] mb-3">Affordable Prices</h3>
            <p className="text-gray-600">
              Premium food that fits your budget — without compromising quality.
            </p>
          </div>
        </div>
      </section>
  )
}

export default Choose