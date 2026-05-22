import { JourneyStage, ProviderCategory } from "@prisma/client";

interface ChecklistInput {
  isFirstTimeBuyer: boolean;
  hasAIP: boolean;
  htbAware: boolean;
  propertyTypes: string[];
}

interface ChecklistItemData {
  stage: JourneyStage;
  section: string;
  title: string;
  description: string;
  sortOrder: number;
  relatedCategory?: ProviderCategory;
  isRequired: boolean;
}

export function generateChecklist(profile: ChecklistInput): ChecklistItemData[] {
  const items: ChecklistItemData[] = [];

  // Stage 1: Getting Mortgage Ready
  items.push({
    stage: JourneyStage.getting_mortgage_ready,
    section: "Finance",
    title: "Calculate your borrowing capacity",
    description: "In Ireland, lenders typically offer up to 3.5x your gross annual salary. Use this to set a realistic budget.",
    sortOrder: 1,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.getting_mortgage_ready,
    section: "Finance",
    title: "Check your credit report",
    description: "Request your credit report from the Central Credit Register (CCR) at centralcreditregister.ie. It's free.",
    sortOrder: 2,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.getting_mortgage_ready,
    section: "Finance",
    title: "Gather your financial documents",
    description: "You will need: last 6 months bank statements, last 3 payslips, most recent P60/Employment Detail Summary, and photo ID.",
    sortOrder: 3,
    isRequired: true,
  });
  if (profile.isFirstTimeBuyer && !profile.htbAware) {
    items.push({
      stage: JourneyStage.getting_mortgage_ready,
      section: "Finance",
      title: "Learn about the Help-to-Buy scheme",
      description: "As a first-time buyer, you may be eligible for a tax refund of up to €30,000 towards your deposit via Revenue's Help-to-Buy scheme.",
      sortOrder: 4,
      isRequired: false,
    });
  }
  if (!profile.hasAIP) {
    items.push({
      stage: JourneyStage.getting_mortgage_ready,
      section: "Finance",
      title: "Open a regular savings account",
      description: "Lenders want to see consistent saving history. Aim for at least 6 months of regular savings before applying for a mortgage.",
      sortOrder: 5,
      isRequired: true,
    });
  }

  // Stage 2: AIP
  items.push({
    stage: JourneyStage.mortgage_approval_in_principle,
    section: "Mortgage",
    title: "Choose a mortgage broker or lender",
    description: "A mortgage broker can compare rates across multiple lenders on your behalf. Alternatively, approach banks directly.",
    sortOrder: 1,
    relatedCategory: ProviderCategory.mortgage_broker,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.mortgage_approval_in_principle,
    section: "Mortgage",
    title: "Submit your AIP application",
    description: "Approval in Principle (AIP) confirms how much a lender will offer you. It's typically valid for 6 months and required before making offers.",
    sortOrder: 2,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.mortgage_approval_in_principle,
    section: "Mortgage",
    title: "Receive your AIP letter",
    description: "Once approved, you'll receive a letter of AIP. Keep this handy — you'll need it when making offers on properties.",
    sortOrder: 3,
    isRequired: true,
  });

  // Stage 3: Property Search
  items.push({
    stage: JourneyStage.property_search,
    section: "Property",
    title: "Register on Daft.ie and MyHome.ie",
    description: "Set up saved searches with alerts on Ireland's main property portals to be first to see new listings.",
    sortOrder: 1,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.property_search,
    section: "Property",
    title: "Attend viewings",
    description: "Note the BER (Building Energy Rating) certificate at each viewing — this affects running costs and is legally required to be displayed.",
    sortOrder: 2,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.property_search,
    section: "Legal",
    title: "Appoint a solicitor",
    description: "Start researching conveyancing solicitors now so you're ready to move quickly when your offer is accepted.",
    sortOrder: 3,
    relatedCategory: ProviderCategory.solicitor,
    isRequired: true,
  });

  // Stage 4: Offer Accepted
  items.push({
    stage: JourneyStage.offer_accepted,
    section: "Legal",
    title: "Pay the booking deposit",
    description: "A booking deposit (typically €5,000–€10,000) secures the property. Note: this is not legally binding until contracts are signed.",
    sortOrder: 1,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.offer_accepted,
    section: "Legal",
    title: "Instruct your solicitor",
    description: "Formally instruct your solicitor to act on your behalf. They will request the contracts from the seller's solicitor.",
    sortOrder: 2,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.offer_accepted,
    section: "Finance",
    title: "Notify your mortgage broker / bank",
    description: "Inform your lender that your offer has been accepted so they can begin the formal mortgage application process.",
    sortOrder: 3,
    isRequired: true,
  });

  // Stage 5: Legal & Conveyancing
  items.push({
    stage: JourneyStage.legal_conveyancing,
    section: "Legal",
    title: "Review contract for sale",
    description: "Your solicitor will review the contracts and raise any queries with the seller's solicitor. Do not sign until you're satisfied.",
    sortOrder: 1,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.legal_conveyancing,
    section: "Legal",
    title: "Sign contracts and pay 10% deposit",
    description: "Once contracts are agreed, you'll sign and pay the balance of the 10% deposit. At this point the sale becomes legally binding.",
    sortOrder: 2,
    isRequired: true,
  });

  // Stage 6: Survey & Valuation
  items.push({
    stage: JourneyStage.survey_and_valuation,
    section: "Survey",
    title: "Book a structural survey",
    description: "An independent structural survey identifies defects and issues. Strongly recommended even if not legally required.",
    sortOrder: 1,
    relatedCategory: ProviderCategory.surveyor,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.survey_and_valuation,
    section: "Survey",
    title: "Book a mortgage valuation",
    description: "Your bank will require an independent valuation to confirm the property is worth what you're paying.",
    sortOrder: 2,
    relatedCategory: ProviderCategory.valuer,
    isRequired: true,
  });
  if (profile.propertyTypes.includes("new_build")) {
    items.push({
      stage: JourneyStage.survey_and_valuation,
      section: "Survey",
      title: "Commission a snag inspection",
      description: "For new builds, a professional snagger will identify defects the developer must fix before you complete the purchase.",
      sortOrder: 3,
      relatedCategory: ProviderCategory.snagger,
      isRequired: true,
    });
  }

  // Stage 7: Drawdown
  items.push({
    stage: JourneyStage.mortgage_drawdown,
    section: "Insurance",
    title: "Arrange mortgage protection insurance",
    description: "Mortgage protection (life cover) is a legal requirement for most mortgages in Ireland. Shop around for the best rate.",
    sortOrder: 1,
    relatedCategory: ProviderCategory.mortgage_protection,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.mortgage_drawdown,
    section: "Insurance",
    title: "Arrange home insurance",
    description: "Home insurance is required by your lender before drawdown. Get quotes before your completion date.",
    sortOrder: 2,
    relatedCategory: ProviderCategory.home_insurance,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.mortgage_drawdown,
    section: "Finance",
    title: "Solicitor requests mortgage funds",
    description: "Your solicitor will request the mortgage funds from your lender ahead of the completion date.",
    sortOrder: 3,
    isRequired: true,
  });

  // Stage 8: Completion
  items.push({
    stage: JourneyStage.completion_and_keys,
    section: "Completion",
    title: "Final walkthrough",
    description: "Do a final inspection of the property before signing off. Check everything agreed is in order.",
    sortOrder: 1,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.completion_and_keys,
    section: "Completion",
    title: "Pay stamp duty",
    description: "Stamp duty is paid via your solicitor on completion: 1% on the first €1m, 2% above. For first-time buyers there is no exemption but Help-to-Buy may assist.",
    sortOrder: 2,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.completion_and_keys,
    section: "Completion",
    title: "Receive your keys",
    description: "Once funds are transferred and title is confirmed, your solicitor will authorise release of the keys. Congratulations!",
    sortOrder: 3,
    isRequired: true,
  });
  items.push({
    stage: JourneyStage.completion_and_keys,
    section: "Completion",
    title: "Register title with the Property Registration Authority",
    description: "Your solicitor will register the property in your name with the PRA. This usually happens in the weeks after completion.",
    sortOrder: 4,
    isRequired: true,
  });

  return items;
}
