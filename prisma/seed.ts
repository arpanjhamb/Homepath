import { PrismaClient, ProviderCategory, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@homepath.ie" },
    update: {},
    create: { email: "admin@homepath.ie", name: "Admin User", passwordHash: adminHash, role: UserRole.admin },
  });

  // Account Executive
  const aeHash = await bcrypt.hash("ae123456", 12);
  const ae = await prisma.user.upsert({
    where: { email: "sarah.murphy@homepath.ie" },
    update: {},
    create: { email: "sarah.murphy@homepath.ie", name: "Sarah Murphy", passwordHash: aeHash, role: UserRole.account_executive },
  });

  // Demo buyer
  const buyerHash = await bcrypt.hash("buyer123", 12);
  await prisma.user.upsert({
    where: { email: "demo@buyer.ie" },
    update: {},
    create: {
      email: "demo@buyer.ie",
      name: "Ciarán O'Brien",
      passwordHash: buyerHash,
      role: UserRole.buyer,
      buyerProfile: { create: { onboardingStatus: "not_started" } },
    },
  });

  // Providers
  const providers = [
    { name: "Doddl Mortgages", category: ProviderCategory.mortgage_broker, shortBio: "Ireland's largest online mortgage broker. Free comparison across all lenders.", description: "Doddl helps Irish home buyers find the best mortgage rate by comparing all major lenders. Their advisors are fully qualified and provide guidance throughout the process. Note: HomePath IE is an introduction service only — Doddl's advisors provide regulated mortgage advice.", counties: ["Dublin", "Cork", "Galway", "Limerick"], nationalCoverage: true, featured: true, commissionRate: 0.5 },
    { name: "Haven Mortgages", category: ProviderCategory.bank, shortBio: "AIB's specialist mortgage arm. Competitive rates for first-time buyers.", description: "Haven Mortgages is AIB's dedicated home loan brand, offering competitive rates and a straightforward application process. Particularly strong on first-time buyer products and Help-to-Buy eligible purchases.", counties: [], nationalCoverage: true, featured: true, commissionRate: 0.3 },
    { name: "Bank of Ireland", category: ProviderCategory.bank, shortBio: "Ireland's largest bank with a comprehensive mortgage product range.", description: "Bank of Ireland offers a wide range of mortgage products including fixed and variable rates. Strong digital application process and dedicated mortgage advisors in branches nationwide.", counties: [], nationalCoverage: true, featured: false, commissionRate: 0.3 },
    { name: "McCann FitzGerald Solicitors", category: ProviderCategory.solicitor, shortBio: "Leading Dublin conveyancing practice with over 30 years experience.", description: "McCann FitzGerald's residential property team handles conveyancing for buyers across Dublin and the greater Leinster area. Fixed fee pricing available for straightforward purchases. HomePath IE provides introductions only — legal advice is provided by the solicitor directly.", counties: ["Dublin", "Kildare", "Wicklow", "Meath"], nationalCoverage: false, featured: true, commissionRate: 8.0 },
    { name: "Sherry FitzGerald Solicitors", category: ProviderCategory.solicitor, shortBio: "Nationwide conveyancing practice with transparent fixed fees.", description: "Sherry FitzGerald's legal division offers residential conveyancing nationwide with transparent fixed fee pricing. Known for keeping buyers informed at every stage of the process.", counties: [], nationalCoverage: true, featured: false, commissionRate: 8.0 },
    { name: "Lisney Chartered Surveyors", category: ProviderCategory.valuer, shortBio: "SCSI-accredited valuers covering Dublin and Leinster.", description: "Lisney's valuation team provides independent market valuations accepted by all major Irish lenders. Fast turnaround with detailed reports.", counties: ["Dublin", "Kildare", "Wicklow", "Meath", "Louth"], nationalCoverage: false, featured: true, commissionRate: 15.0 },
    { name: "Surveyors Ireland", category: ProviderCategory.surveyor, shortBio: "Structural surveys and condition reports for all property types.", description: "Surveyors Ireland provides comprehensive structural surveys and condition reports. Reports are clear, jargon-free, and include priority ratings for identified issues.", counties: [], nationalCoverage: true, featured: true, commissionRate: 12.0 },
    { name: "SnagIt Ireland", category: ProviderCategory.snagger, shortBio: "Specialist new build snag inspectors. Same-week appointments.", description: "SnagIt Ireland specialises in new build snag inspections. Their detailed reports identify defects and incomplete works that developers are contractually required to fix before completion.", counties: ["Dublin", "Cork", "Galway", "Limerick", "Kildare", "Meath"], nationalCoverage: false, featured: true, commissionRate: 10.0 },
    { name: "Aviva Home Insurance", category: ProviderCategory.home_insurance, shortBio: "Comprehensive home insurance from one of Ireland's leading insurers.", description: "Aviva offers buildings and contents insurance tailored for Irish home buyers. Competitive premiums with flexible cover options. Required by lenders before mortgage drawdown.", counties: [], nationalCoverage: true, featured: true, commissionRate: 5.0 },
    { name: "Irish Life Mortgage Protection", category: ProviderCategory.mortgage_protection, shortBio: "Mortgage protection from Ireland's largest life insurer.", description: "Irish Life provides mortgage protection insurance — a legal requirement for most mortgages in Ireland. Competitive premiums with optional serious illness cover add-on.", counties: [], nationalCoverage: true, featured: true, commissionRate: 15.0 },
    { name: "Eir Broadband", category: ProviderCategory.broadband_utilities, shortBio: "Ireland's most widely available home broadband provider.", description: "Eir offers fibre broadband across the widest geographic footprint in Ireland. Bundle options available with TV and phone. Order 2–4 weeks in advance of your move-in date.", counties: [], nationalCoverage: true, featured: false, commissionRate: 3.0 },
    { name: "Murphy's Removals", category: ProviderCategory.mover, shortBio: "Family-run removal company serving Dublin and Leinster since 1998.", description: "Murphy's Removals has been helping Dublin families move home for over 25 years. Full packing service available, short-term storage, and competitive fixed-price quotes.", counties: ["Dublin", "Kildare", "Wicklow", "Meath", "Louth"], nationalCoverage: false, featured: true, commissionRate: 5.0 },
  ];

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { id: p.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: p.name.toLowerCase().replace(/\s+/g, "-"), ...p },
    });
  }

  console.log("Seed complete. Accounts:");
  console.log("  Admin:   admin@homepath.ie / admin123");
  console.log("  AE:      sarah.murphy@homepath.ie / ae123456");
  console.log("  Buyer:   demo@buyer.ie / buyer123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
