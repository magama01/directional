interface CoffeeConsumption {
    team: "Frontend" | "Backend" | "AI";
    series: CoffeeConsumptionSeries[]
}

interface CoffeeConsumptionSeries {
    cups: number;
    bugs: number;
    productivity: number;
}

export type {CoffeeConsumption, CoffeeConsumptionSeries}
