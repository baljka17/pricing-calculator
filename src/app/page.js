"use client";
import { useState, useEffect } from "react";

export default function PricingCalculator() {
  // Fixed costs state
  const [fixedCosts, setFixedCosts] = useState({
    salary: 20000000,
    serverCost: 1000000,
    marketing: 500000,
    office: 0,
    software: 700000,
    miscellaneous: 500000,
  });

  // Mongolian translations for fixed costs
  const fixedCostsLabels = {
    salary: "Цалин",
    serverCost: "Сервер зардал",
    marketing: "Маркетинг",
    office: "Оффис",
    software: "Програм хангамж",
    miscellaneous: "Бусад зардал",
  };

  // Pricing tiers state
  const [pricing, setPricing] = useState({
    retail: {
      monthlyPrice: 5000,
      annualPrice: 0,
      features: [
        "Үндсэн санхүүгийн тайлан",
        "1 хэрэглэгч",
        "Имэйл дэмжлэг",
        "2 тайлан",
      ],
    },
    starter: {
      monthlyPrice: 696500,
      annualPrice: 6965000,
      features: [
        "Үндсэн санхүүгийн шинжилгээ",
        "3 хүртэлх хэрэглэгч",
        "Ердийн дэмжлэг",
        "5 тайлан",
      ],
    },
    growth: {
      monthlyPrice: 1396500,
      annualPrice: 13965000,
      features: [
        "Гүнзгий санхүүгийн шинжилгээ",
        "10 хүртэлх хэрэглэгч",
        "Тэргүүлэх дэмжлэг",
        "20 тайлан",
        "API хандалт",
      ],
    },
    enterprise: {
      monthlyPrice: 3496500,
      annualPrice: 34965000,
      features: [
        "Бүрэн санхүүгийн шинжилгээ",
        "Хязгааргүй хэрэглэгч",
        "24/7 онцгой дэмжлэг",
        "Хязгааргүй тайлан",
        "API хандалт",
        "Захиалгат функцууд",
      ],
    },
  });

  // Mongolian translations for pricing tiers
  const pricingLabels = {
    retail: "Жижиглэн",
    starter: "Эхлэл",
    growth: "Өсөлт",
    enterprise: "Энтерпрайз",
  };

  // Financial projections state
  const [projections, setProjections] = useState({
    retailCustomers: 0,
    starterCustomers: 10,
    growthCustomers: 0,
    enterpriseCustomers: 0,
    annualSubscriptions: false,
    months: 12,
  });

  // Calculated values
  const [totalFixedCosts, setTotalFixedCosts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [breakevenMonths, setBreakevenMonths] = useState(0);

  // Handle fixed cost input changes
  const handleFixedCostChange = (key, value) => {
    setFixedCosts((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // Handle pricing tier changes
  const handlePricingChange = (tier, field, value) => {
    setPricing((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: field.includes("Price") ? Number(value) : value,
      },
    }));
  };

  // Handle projection changes
  const handleProjectionChange = (field, value) => {
    setProjections((prev) => ({
      ...prev,
      [field]: field === "annualSubscriptions" ? Boolean(value) : Number(value),
    }));
  };

  // Calculate financials
  useEffect(() => {
    // Calculate total fixed costs
    const totalFixed =
      Object.values(fixedCosts).reduce((sum, cost) => sum + cost, 0) *
      projections.months;
    setTotalFixedCosts(totalFixed);

    // Calculate monthly revenue from each tier
    const monthlyPriceKey = projections.annualSubscriptions
      ? "annualPrice"
      : "monthlyPrice";
    const divider = projections.annualSubscriptions ? 1 : 12;

    const retailRevenue =
      ((pricing.retail[monthlyPriceKey] * projections.retailCustomers) /
        divider) *
      projections.months;
    const starterRevenue =
      ((pricing.starter[monthlyPriceKey] * projections.starterCustomers) /
        divider) *
      projections.months;
    const growthRevenue =
      ((pricing.growth[monthlyPriceKey] * projections.growthCustomers) /
        divider) *
      projections.months;
    const enterpriseRevenue =
      ((pricing.enterprise[monthlyPriceKey] * projections.enterpriseCustomers) /
        divider) *
      projections.months;

    const revenue =
      (retailRevenue + starterRevenue + growthRevenue + enterpriseRevenue) *
      projections.months;
    setTotalRevenue(revenue);

    // Calculate profit
    const calculatedProfit = revenue - totalFixed;
    setProfit(calculatedProfit);

    // Calculate breakeven point in months
    const monthlyRevenue = revenue / projections.months;
    const monthlyFixedCosts = totalFixed / projections.months;

    if (monthlyRevenue > 0) {
      setBreakevenMonths(Math.ceil(totalFixed / monthlyRevenue));
    } else {
      setBreakevenMonths(Infinity);
    }
  }, [fixedCosts, pricing, projections]);

  // Format currency in MNT (Mongolian Tugrik)
  const formatCurrency = (amount) => {
    // Display in MNT without further conversion since values are already in MNT
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MNT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col p-6 gap-8 bg-gray-50 min-h-screen">
      <header className="text-center">
        <h2 className="text-xl text-blue-600">Үнийн Тооцоолуур</h2>
      </header>

      <div className="flex flex-wrap gap-8">
        {/* Fixed Costs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-80">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            Тогтмол Зардлууд
          </h2>
          <div className="space-y-4">
            {Object.entries(fixedCosts).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <label className="capitalize text-gray-700">
                  {fixedCostsLabels[key]}:
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">₮</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleFixedCostChange(key, Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-1 w-32 text-right"
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between font-bold">
                <span>Нийт Сарын Тогтмол Зардал:</span>
                <span>
                  {formatCurrency(
                    Object.values(fixedCosts).reduce(
                      (sum, cost) => sum + cost,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-80">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Төсөөлөл</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label>Жижиглэн Гишүүд:</label>
              <input
                type="number"
                value={projections.retailCustomers}
                onChange={(e) =>
                  handleProjectionChange(
                    "retailCustomers",
                    Number(e.target.value)
                  )
                }
                className="border border-gray-300 rounded px-3 py-1 w-24 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Эхлэл Гишүүд:</label>
              <input
                type="number"
                value={projections.starterCustomers}
                onChange={(e) =>
                  handleProjectionChange(
                    "starterCustomers",
                    Number(e.target.value)
                  )
                }
                className="border border-gray-300 rounded px-3 py-1 w-24 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Өсөлт Гишүүд:</label>
              <input
                type="number"
                value={projections.growthCustomers}
                onChange={(e) =>
                  handleProjectionChange(
                    "growthCustomers",
                    Number(e.target.value)
                  )
                }
                className="border border-gray-300 rounded px-3 py-1 w-24 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Энтерпрайз Гишүүд:</label>
              <input
                type="number"
                value={projections.enterpriseCustomers}
                onChange={(e) =>
                  handleProjectionChange(
                    "enterpriseCustomers",
                    Number(e.target.value)
                  )
                }
                className="border border-gray-300 rounded px-3 py-1 w-24 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Төсөөллийн хугацаа (сар):</label>
              <input
                type="number"
                min="1"
                max="60"
                value={projections.months}
                onChange={(e) =>
                  handleProjectionChange("months", Number(e.target.value))
                }
                className="border border-gray-300 rounded px-3 py-1 w-24 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Жилийн захиалга:</label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={projections.annualSubscriptions}
                  onChange={(e) =>
                    handleProjectionChange(
                      "annualSubscriptions",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between font-bold">
              <span>Нийт Орлого ({projections.months} сар):</span>
              <span className="text-green-600">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Нийт Тогтмол Зардал:</span>
              <span className="text-red-600">
                {formatCurrency(totalFixedCosts)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>Ашиг:</span>
              <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                {formatCurrency(profit)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Хугарлын цэг хугацаа:</span>
              <span>
                {isFinite(breakevenMonths)
                  ? `${breakevenMonths} сар`
                  : "Боломжгүй"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Үнийн Багцууд</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(pricing).map(([tier, details]) => (
            <div
              key={tier}
              className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${
                tier === "retail"
                  ? "border-green-400"
                  : tier === "starter"
                  ? "border-blue-400"
                  : tier === "growth"
                  ? "border-purple-500"
                  : "border-indigo-700"
              }`}
            >
              <h3 className="text-lg font-bold capitalize mb-2">
                {pricingLabels[tier]}
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600">
                    Сарын Үнэ (₮)
                  </label>
                  <input
                    type="number"
                    value={details.monthlyPrice}
                    onChange={(e) =>
                      handlePricingChange(tier, "monthlyPrice", e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-1 w-full mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">
                    Жилийн Үнэ (₮)
                  </label>

                  {formatCurrency(details.monthlyPrice * 10)}
                  <input
                    type="number"
                    value={details.annualPrice}
                    onChange={(e) =>
                      handlePricingChange(tier, "annualPrice", e.target.value)
                    }
                    className="hidden border border-gray-300 rounded px-3 py-1 w-full mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(
                      (1 - details.annualPrice / (details.monthlyPrice * 12)) *
                        100
                    )}
                    % хэмнэлт
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold mb-2">Боломжууд:</p>
                <ul className="space-y-1">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="mr-2 text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Cost coverage calculation */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-sm mb-1">
                    Зардлын Хамрах Хүрээ:
                  </p>
                  {(() => {
                    const monthlyFixedCost = Object.values(fixedCosts).reduce(
                      (sum, cost) => sum + cost,
                      0
                    );
                    const monthlyPrice = details.monthlyPrice;
                    const customersNeeded = Math.ceil(
                      monthlyFixedCost / monthlyPrice
                    );
                    const retailRatio =
                      monthlyPrice / pricing.retail.monthlyPrice;
                    const coveragePercent = (
                      (monthlyPrice / monthlyFixedCost) *
                      100
                    ).toFixed(1);

                    return (
                      <div className="text-sm">
                        <p>
                          Нэг захиалга:{" "}
                          <span className="font-medium">
                            {coveragePercent}%
                          </span>{" "}
                          зардлыг хаана
                        </p>
                        <p>
                          Зардал бүрэн хаахад:{" "}
                          <span className="font-medium">{customersNeeded}</span>{" "}
                          захиалга хэрэгтэй
                        </p>
                        <p>
                          Хуулганы тоо:{" "}
                          <span className="font-medium">{retailRatio}</span>{" "}
                          тэнцэнэ
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
