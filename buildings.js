export const buildings = [
    { id: "cursor", basePrice: 15, count: 0, baseCps: 0.1, cps: 0.1, displayPrereq: "none"},
    { id: "grandma", basePrice: 100, count: 0, baseCps: 1, cps: 1, displayPrereq: "none"},
    { id: "farm", basePrice: 1100, count: 0, baseCps: 8, cps: 8, displayPrereq: "cursor"},
    { id: "mine", basePrice: 12000, count: 0, baseCps: 47, cps: 47, displayPrereq: "grandma"},
    { id: "factory", basePrice: 130000, count: 0, baseCps: 260, cps: 260, displayPrereq: "farm"},
    { id: "bank", basePrice: 1400000, count: 0, baseCps: 1400, cps: 1400, displayPrereq: "mine"}
];