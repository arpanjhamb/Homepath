import { ProviderCategory, JourneyStage } from "@prisma/client";

export const PROVIDER_CATEGORIES = [
  { key: ProviderCategory.mortgage_broker, label: "Mortgage Brokers", icon: "TrendingUp", description: "Find the best mortgage rate for your situation" },
  { key: ProviderCategory.bank, label: "Banks", icon: "Building2", description: "Apply directly with Ireland's main lenders" },
  { key: ProviderCategory.solicitor, label: "Solicitors", icon: "Scale", description: "Expert conveyancing solicitors nationwide" },
  { key: ProviderCategory.valuer, label: "Valuers", icon: "ClipboardList", description: "Independent property valuations" },
  { key: ProviderCategory.surveyor, label: "Surveyors", icon: "Search", description: "Structural surveys and property reports" },
  { key: ProviderCategory.snagger, label: "Snag Inspectors", icon: "CheckSquare", description: "New build snag list inspections" },
  { key: ProviderCategory.home_insurance, label: "Home Insurance", icon: "Shield", description: "Protect your new home from day one" },
  { key: ProviderCategory.mortgage_protection, label: "Mortgage Protection", icon: "HeartPulse", description: "Required life cover for your mortgage" },
  { key: ProviderCategory.flooring, label: "Flooring", icon: "Layers", description: "Flooring specialists and installers" },
  { key: ProviderCategory.mover, label: "Removal Companies", icon: "Truck", description: "Trusted removal and moving companies" },
  { key: ProviderCategory.broadband_utilities, label: "Broadband & Utilities", icon: "Wifi", description: "Set up broadband and utilities in your new home" },
];

export const IRISH_COUNTIES = [
  "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin",
  "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim",
  "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan",
  "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford",
  "Westmeath", "Wexford", "Wicklow",
];

export const JOURNEY_STAGES: { stage: JourneyStage; label: string; order: number }[] = [
  { stage: JourneyStage.getting_mortgage_ready, label: "Get Mortgage Ready", order: 1 },
  { stage: JourneyStage.mortgage_approval_in_principle, label: "Mortgage AIP", order: 2 },
  { stage: JourneyStage.property_search, label: "Property Search", order: 3 },
  { stage: JourneyStage.offer_accepted, label: "Offer Accepted", order: 4 },
  { stage: JourneyStage.legal_conveyancing, label: "Legal & Contracts", order: 5 },
  { stage: JourneyStage.survey_and_valuation, label: "Survey & Valuation", order: 6 },
  { stage: JourneyStage.mortgage_drawdown, label: "Mortgage Drawdown", order: 7 },
  { stage: JourneyStage.completion_and_keys, label: "Completion & Keys", order: 8 },
];
