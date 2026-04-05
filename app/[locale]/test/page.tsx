import React from 'react'

const cards = [
  { image: "https://www.suncor.com/-/media/project/suncor/images/home/feature-callout/truck.jpg?mw=304", 
    title: "Long-life, competitively advantaged assets" },
  { image: "https://www.suncor.com/-/media/project/suncor/images/home/feature-callout/petrocan.jpg?mw=304", 
    title: "Regional and vertical integration" },
  { image: "https://www.suncor.com/-/media/project/suncor/images/home/feature-callout/base-plant-ops-aerial.jpg?mw=304", 
    title: "Operational reliability" },
  { image: "https://www.suncor.com/-/media/project/suncor/images/home/feature-callout/wapisiw-lookout.jpg?mw=304", 
    title: "Disciplined investment and cost management" },
];

const test = () => {
  return (
    <section className="bg-dusty-blue px-4 py-12 md:px-4 md:py-8">
      {/* Label */}
      <p className="text-s md:text-lg font-bold uppercase text-white mb-4 md:text-base md:mb-8">
        Our Value Proposition
      </p>

      {/* Heading */}
      <h2 className="text-2xl md:text-[32px] font-bold text-white mb-4 md:mb-8">
        Deliver superior long-term shareholder value
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-md overflow-hidden">
            <img
              src={card.image}
              alt={card.title}
              className="w-full object-cover h-[200px] md:h-[145px]"
            />
            <div className="p-6 pb-12">
              <p className="text-[20px] md:text-[22px] font-bold text-gray-900">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default test;