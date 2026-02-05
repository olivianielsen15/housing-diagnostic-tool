/* =============================================
   Housing Sector Diagnostic Tool - Core Engine
   ============================================= */

// ---- State ----
const state = {
    currentStep: 0,
    answers: {
        stakeholder: null,
        geography: null,
        deficitType: null,
        rootCause: null,
        specificIssue: null,
    },
};

const STEPS = ['welcomeScreen', 'step1', 'step2', 'step3', 'step4', 'step5', 'resultsScreen'];
const TOTAL_QUESTION_STEPS = 5;

// ---- Supply-Side Specific Issues ----
const supplyIssues = [
    {
        value: 'land',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="4" y="32" width="40" height="8" rx="2" fill="#2563eb"/><path d="M12 32V20l8-6 8 6v12" fill="#93c5fd"/><rect x="18" y="24" width="4" height="8" fill="#2563eb"/><path d="M36 32V16" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2"/><line x1="32" y1="20" x2="40" y2="12" stroke="#ef4444" stroke-width="2"/></svg>`,
        title: 'Land Availability & Cost',
        description: 'Scarce, expensive, or inaccessible land for housing development. Includes zoning constraints and unclear land tenure.',
    },
    {
        value: 'materials',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="6" y="28" width="12" height="8" fill="#d97706"/><rect x="6" y="20" width="12" height="8" fill="#f59e0b"/><rect x="20" y="28" width="12" height="8" fill="#f59e0b"/><rect x="20" y="20" width="12" height="8" fill="#d97706"/><rect x="34" y="28" width="8" height="8" fill="#d97706"/><path d="M10 14l4-6 4 6" stroke="#ef4444" stroke-width="2"/></svg>`,
        title: 'Construction Materials',
        description: 'High cost, limited availability, or reliance on imported building materials. Quality control issues.',
    },
    {
        value: 'labor',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="16" cy="14" r="6" fill="#2563eb"/><path d="M4 38v-6a12 12 0 0124 0v6" fill="#93c5fd"/><circle cx="34" cy="14" r="5" fill="#94a3b8" stroke="#94a3b8" stroke-dasharray="2 2"/><line x1="30" y1="10" x2="38" y2="18" stroke="#ef4444" stroke-width="2"/></svg>`,
        title: 'Skilled Labor Shortage',
        description: 'Insufficient skilled construction workers, limited vocational training, or labor productivity challenges.',
    },
    {
        value: 'regulatory',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="10" y="8" width="28" height="34" rx="2" fill="#2563eb"/><rect x="16" y="14" width="16" height="2" rx="1" fill="#93c5fd"/><rect x="16" y="20" width="16" height="2" rx="1" fill="#93c5fd"/><rect x="16" y="26" width="16" height="2" rx="1" fill="#93c5fd"/><rect x="16" y="32" width="10" height="2" rx="1" fill="#93c5fd"/><circle cx="38" cy="36" r="8" fill="#ef4444"/><path d="M34 36h8" stroke="#fff" stroke-width="2"/></svg>`,
        title: 'Regulatory & Permitting Barriers',
        description: 'Complex approval processes, outdated building codes, excessive regulations that slow housing production.',
    },
    {
        value: 'infrastructure',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><path d="M4 40h40" stroke="#64748b" stroke-width="2"/><path d="M8 40V28h6v12M18 40V24h6v16M28 40V20h6v20M38 40V28" stroke="#2563eb" stroke-width="3"/><path d="M38 28v12" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2"/></svg>`,
        title: 'Infrastructure Deficits',
        description: 'Lack of trunk infrastructure (roads, water, sewerage, electricity) needed to develop housing at scale.',
    },
];

// ---- Financing/Demand-Side Specific Issues ----
const financingIssues = [
    {
        value: 'income',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="24" cy="14" r="8" fill="#2563eb"/><path d="M8 42v-6a16 16 0 0132 0v6" fill="#93c5fd"/><path d="M18 42l-4-10M30 42l4-10" stroke="#ef4444" stroke-width="2"/></svg>`,
        title: 'Lack of Formal Income',
        description: 'Informal employment, inability to document income, or income levels too low to qualify for financing.',
    },
    {
        value: 'interest_rates',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><path d="M8 36l8-8 8 4 8-16 8 4" stroke="#ef4444" stroke-width="3" fill="none"/><circle cx="40" cy="20" r="4" fill="#ef4444"/><text x="24" y="44" text-anchor="middle" fill="#64748b" font-size="10">%</text></svg>`,
        title: 'High Interest Rates',
        description: 'Prohibitively high mortgage rates, macroeconomic instability, or lack of long-term funding for lenders.',
    },
    {
        value: 'mortgage_products',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="6" y="12" width="36" height="24" rx="3" fill="#2563eb"/><rect x="6" y="18" width="36" height="6" fill="#1d4ed8"/><rect x="12" y="28" width="14" height="3" rx="1" fill="#93c5fd"/><circle cx="36" cy="30" r="4" fill="#93c5fd"/></svg>`,
        title: 'Insufficient Mortgage Products',
        description: 'Limited range of housing finance products, lack of innovation, products mismatched to market needs.',
    },
    {
        value: 'subsidies',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="24" cy="24" r="16" fill="#16a34a"/><text x="24" y="30" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">$</text><line x1="12" y1="12" x2="36" y2="36" stroke="#ef4444" stroke-width="3"/></svg>`,
        title: 'Lack of Subsidy Programs',
        description: 'Absence of housing subsidies, poorly targeted support, or insufficient public funding for housing assistance.',
    },
    {
        value: 'title',
        icon: `<svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="8" y="6" width="32" height="36" rx="2" fill="#f59e0b"/><rect x="14" y="12" width="20" height="2" fill="#fff"/><rect x="14" y="18" width="20" height="2" fill="#fff"/><rect x="14" y="24" width="14" height="2" fill="#fff"/><circle cx="36" cy="36" r="8" fill="#ef4444"/><text x="36" y="40" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">?</text></svg>`,
        title: 'Property Title & Registration',
        description: 'Unclear property rights, costly or slow registration processes, lack of formal land documentation.',
    },
];

// ---- Solutions Database ----
// Key format: "stakeholder|geography|deficitType|rootCause|specificIssue"
// Solutions organized by category with title + description
const solutionsDatabase = {
    // ======================
    // GOVERNMENT - SUPPLY
    // ======================
    'government|urban|quantitative|supply|land': {
        categories: [
            {
                name: 'Land Policy Reform',
                solutions: [
                    { title: 'Implement land value capture mechanisms', desc: 'Use betterment levies, tax increment financing, or sale of development rights to fund infrastructure and cross-subsidize affordable housing.' },
                    { title: 'Release public land for housing', desc: 'Audit government land holdings and create a pipeline of surplus land for affordable housing development through transparent allocation.' },
                    { title: 'Strengthen urban planning & zoning reform', desc: 'Increase density allowances, adopt inclusionary zoning, and enable mixed-use development near transit corridors.' },
                    { title: 'Create municipal land banks', desc: 'Establish entities to acquire, manage, and dispose of vacant and underutilized properties for affordable housing.' },
                ],
            },
            {
                name: 'Public-Private Partnerships',
                solutions: [
                    { title: 'Design PPP frameworks for land development', desc: 'Create standardized concession models where private developers build affordable units in exchange for density bonuses or public land access.' },
                    { title: 'Enable community land trusts', desc: 'Support collective land ownership models that keep housing permanently affordable while allowing homeownership benefits.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|supply|materials': {
        categories: [
            {
                name: 'Construction Industry Development',
                solutions: [
                    { title: 'Support local building material manufacturing', desc: 'Provide incentives for local production of cement, steel, and other critical materials to reduce import dependence.' },
                    { title: 'Reduce import duties on building materials', desc: 'Review and lower tariffs on essential construction inputs not produced domestically, while protecting strategic industries.' },
                    { title: 'Promote alternative building technologies', desc: 'Support R&D and adoption of cost-effective methods like prefabrication, compressed earth blocks, and 3D printing.' },
                ],
            },
            {
                name: 'Quality & Standards',
                solutions: [
                    { title: 'Establish material testing centers', desc: 'Create regional laboratories to certify building materials, ensuring quality while reducing cost of compliance.' },
                    { title: 'Create bulk procurement programs', desc: 'Enable government-coordinated bulk purchasing of materials to achieve economies of scale for social housing programs.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|supply|labor': {
        categories: [
            {
                name: 'Workforce Development',
                solutions: [
                    { title: 'Invest in construction vocational training', desc: 'Expand TVET programs focused on modern construction techniques, create certification standards, and fund training centers.' },
                    { title: 'Create apprenticeship programs', desc: 'Partner with construction firms to develop structured learn-and-earn programs for young workers entering the trades.' },
                    { title: 'Support women in construction', desc: 'Remove barriers and create targeted programs to increase female participation in the construction workforce.' },
                ],
            },
            {
                name: 'Productivity Enhancement',
                solutions: [
                    { title: 'Promote prefabrication & modular construction', desc: 'Incentivize factory-based manufacturing of housing components to reduce on-site labor needs and improve quality.' },
                    { title: 'Adopt construction technology', desc: 'Support adoption of BIM, project management software, and mechanized construction to improve labor productivity.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|supply|regulatory': {
        categories: [
            {
                name: 'Regulatory Reform',
                solutions: [
                    { title: 'Streamline building permit processes', desc: 'Implement one-stop-shop approvals, set maximum processing timelines, and digitize the entire permitting workflow.' },
                    { title: 'Adopt performance-based building codes', desc: 'Replace prescriptive codes with outcome-based standards that allow innovation while maintaining safety.' },
                    { title: 'Create fast-track approvals for affordable housing', desc: 'Establish expedited review processes for projects meeting affordability criteria and design standards.' },
                ],
            },
            {
                name: 'Institutional Strengthening',
                solutions: [
                    { title: 'Digitize land and property registration', desc: 'Implement digital cadastre systems, blockchain-based registries, or unified land information systems.' },
                    { title: 'Implement risk-based inspection regimes', desc: 'Focus inspection resources on high-risk projects while streamlining oversight for standard residential construction.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|supply|infrastructure': {
        categories: [
            {
                name: 'Infrastructure Investment',
                solutions: [
                    { title: 'Invest in trunk infrastructure for housing areas', desc: 'Prioritize capital budgets for water, roads, and sewerage in areas designated for housing expansion.' },
                    { title: 'Plan transit-oriented development corridors', desc: 'Align housing growth with public transport investment to create connected, affordable neighborhoods.' },
                ],
            },
            {
                name: 'Infrastructure Financing',
                solutions: [
                    { title: 'Implement developer impact fees', desc: 'Require fair-share infrastructure contributions from developers while maintaining housing affordability.' },
                    { title: 'Create infrastructure financing facilities', desc: 'Establish revolving funds or bond mechanisms to pre-finance infrastructure for housing development areas.' },
                    { title: 'Use cross-subsidy models', desc: 'Leverage revenue from commercial or higher-income development to fund infrastructure for affordable housing.' },
                ],
            },
        ],
    },
    // ======================
    // GOVERNMENT - FINANCING
    // ======================
    'government|urban|quantitative|financing|income': {
        categories: [
            {
                name: 'Inclusive Finance Programs',
                solutions: [
                    { title: 'Develop housing microfinance programs', desc: 'Support incremental housing lending for informal-sector workers, using alternative credit assessment methods.' },
                    { title: 'Create rental housing programs', desc: 'Invest in public or social rental housing to serve households that cannot access ownership finance.' },
                    { title: 'Implement housing voucher programs', desc: 'Provide demand-side rental subsidies that give households choice while supporting private rental supply.' },
                ],
            },
            {
                name: 'Income Formalization',
                solutions: [
                    { title: 'Support community savings groups', desc: 'Formalize and link savings groups to housing finance providers, building credit history for informal earners.' },
                    { title: 'Promote alternative income verification', desc: 'Encourage lenders to accept utility payments, mobile money records, and savings patterns as income proxies.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|financing|interest_rates': {
        categories: [
            {
                name: 'Financial Market Development',
                solutions: [
                    { title: 'Create housing finance guarantee facilities', desc: 'Establish partial credit guarantee schemes to reduce lender risk and enable lower interest rates for borrowers.' },
                    { title: 'Establish mortgage liquidity facilities', desc: 'Create secondary mortgage market institutions to provide long-term funding to primary lenders at lower cost.' },
                    { title: 'Develop mortgage-backed securities', desc: 'Build frameworks for securitization to attract institutional investors and deepen housing finance markets.' },
                ],
            },
            {
                name: 'Direct Interventions',
                solutions: [
                    { title: 'Implement interest rate subsidy programs', desc: 'Provide targeted, time-bound interest rate buy-downs for low-income borrowers, with clear fiscal sustainability plans.' },
                    { title: 'Develop government-backed mortgage insurance', desc: 'Reduce default risk for lenders, enabling lower down payments and interest rates for qualifying borrowers.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|financing|mortgage_products': {
        categories: [
            {
                name: 'Product Innovation',
                solutions: [
                    { title: 'Encourage mortgage product innovation', desc: 'Create regulatory sandbox for new housing finance products, including graduated payment and shared equity models.' },
                    { title: 'Support Sharia-compliant housing finance', desc: 'Develop regulatory frameworks for Islamic housing finance products like Ijara, Murabaha, and Musharaka.' },
                    { title: 'Create shared equity homeownership programs', desc: 'Enable government or nonprofit equity sharing to reduce upfront costs while building household wealth.' },
                ],
            },
            {
                name: 'Market Expansion',
                solutions: [
                    { title: 'Develop cooperative housing finance models', desc: 'Support housing cooperatives with tailored group lending products and technical assistance.' },
                    { title: 'Enable rent-to-own schemes', desc: 'Create legal and financial frameworks for gradual homeownership pathways, especially for young households.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|financing|subsidies': {
        categories: [
            {
                name: 'Subsidy Design',
                solutions: [
                    { title: 'Design demand-side housing subsidies', desc: 'Create means-tested capital grants or deposit assistance that follow the household, not the housing unit.' },
                    { title: 'Implement capital grants for affordable housing', desc: 'Provide supply-side subsidies tied to affordability requirements, quality standards, and location criteria.' },
                    { title: 'Develop cross-subsidy mechanisms', desc: 'Require mixed-income developments where market-rate units subsidize affordable units within the same project.' },
                ],
            },
            {
                name: 'Funding & Incentives',
                solutions: [
                    { title: 'Create tax incentives for affordable housing', desc: 'Offer tax credits, exemptions, or deductions to developers and investors who produce affordable housing.' },
                    { title: 'Establish dedicated housing funds', desc: 'Create ring-fenced funding from earmarked taxes, developer levies, or budget allocations for housing programs.' },
                ],
            },
        ],
    },
    'government|urban|quantitative|financing|title': {
        categories: [
            {
                name: 'Tenure Security',
                solutions: [
                    { title: 'Implement systematic land titling programs', desc: 'Roll out efficient, low-cost adjudication and registration of land rights across informal and formal settlements.' },
                    { title: 'Create alternative forms of tenure security', desc: 'Recognize occupancy certificates, community tenure, and other intermediate forms of land rights.' },
                ],
            },
            {
                name: 'Registration Reform',
                solutions: [
                    { title: 'Digitize property registration systems', desc: 'Invest in digital land registries to reduce fraud, lower costs, and speed up property transactions.' },
                    { title: 'Reduce cost and time for property registration', desc: 'Simplify procedures, cut fees, and decentralize registration services to improve accessibility.' },
                    { title: 'Support community land trusts', desc: 'Enable collective ownership models that provide tenure security while preventing speculative displacement.' },
                ],
            },
        ],
    },
    // ==================================
    // GOVERNMENT - QUALITATIVE VARIANTS
    // ==================================
    'government|urban|qualitative|supply|land': {
        categories: [
            {
                name: 'Upgrading & Redevelopment',
                solutions: [
                    { title: 'Launch in-situ slum upgrading programs', desc: 'Improve existing settlements rather than relocating residents, providing infrastructure, tenure, and housing improvements.' },
                    { title: 'Create urban renewal frameworks', desc: 'Develop legal and financial tools for upgrading deteriorated neighborhoods while preventing displacement.' },
                    { title: 'Implement land readjustment programs', desc: 'Pool fragmented landholdings to enable planned redevelopment with improved infrastructure and housing quality.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|supply|materials': {
        categories: [
            {
                name: 'Quality Improvement',
                solutions: [
                    { title: 'Create home improvement material programs', desc: 'Subsidize or provide in-kind access to quality building materials for households upgrading existing homes.' },
                    { title: 'Establish technical assistance for self-builders', desc: 'Provide free or low-cost architectural and engineering support for households building incrementally.' },
                    { title: 'Promote durable affordable materials', desc: 'Research and promote locally-appropriate materials that improve housing quality at accessible price points.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|supply|labor': {
        categories: [
            {
                name: 'Skills for Quality',
                solutions: [
                    { title: 'Train artisans in quality construction', desc: 'Targeted training for masons, plumbers, and electricians on building code compliance and safety standards.' },
                    { title: 'Create community-based construction teams', desc: 'Support local teams trained in housing improvement, creating jobs while upgrading neighborhood housing quality.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|supply|regulatory': {
        categories: [
            {
                name: 'Standards & Enforcement',
                solutions: [
                    { title: 'Update minimum housing standards', desc: 'Review and modernize habitability standards covering structural safety, ventilation, sanitation, and space.' },
                    { title: 'Strengthen building inspection capacity', desc: 'Invest in trained inspectors and digital monitoring tools to improve code compliance in existing housing.' },
                    { title: 'Create retrofitting incentive programs', desc: 'Provide grants or low-interest loans for homeowners to bring substandard properties up to code.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|supply|infrastructure': {
        categories: [
            {
                name: 'Service Delivery',
                solutions: [
                    { title: 'Extend basic services to underserved areas', desc: 'Invest in water, sanitation, electricity, and drainage for neighborhoods with qualitative housing deficits.' },
                    { title: 'Implement neighborhood upgrading programs', desc: 'Holistic programs that combine infrastructure, public spaces, and housing improvements at the community level.' },
                    { title: 'Develop community-managed infrastructure', desc: 'Support models where residents participate in constructing and maintaining local infrastructure.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|financing|income': {
        categories: [
            {
                name: 'Home Improvement Finance',
                solutions: [
                    { title: 'Create home improvement loan programs', desc: 'Small, short-term loans for incremental housing upgrades accessible to informal-sector earners.' },
                    { title: 'Develop community-driven upgrading funds', desc: 'Support neighborhood-level revolving funds where residents pool savings for housing improvements.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|financing|interest_rates': {
        categories: [
            {
                name: 'Affordable Renovation Finance',
                solutions: [
                    { title: 'Subsidize renovation lending rates', desc: 'Provide interest rate support for home improvement loans targeted at bringing housing up to minimum standards.' },
                    { title: 'Create green renovation financing', desc: 'Link housing improvement finance to energy efficiency and climate resilience upgrades with favorable terms.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|financing|mortgage_products': {
        categories: [
            {
                name: 'Incremental Finance Products',
                solutions: [
                    { title: 'Develop micro-mortgage products for upgrading', desc: 'Create small-value, flexible loans specifically designed for progressive housing improvement.' },
                    { title: 'Enable savings-linked improvement loans', desc: 'Connect savings products to home improvement lending, building financial capability alongside housing quality.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|financing|subsidies': {
        categories: [
            {
                name: 'Upgrading Subsidies',
                solutions: [
                    { title: 'Create targeted home improvement grants', desc: 'Means-tested grants for critical safety and habitability improvements in owner-occupied housing.' },
                    { title: 'Implement weatherization and resilience programs', desc: 'Public programs to improve structural safety, thermal comfort, and disaster resilience of existing housing.' },
                ],
            },
        ],
    },
    'government|urban|qualitative|financing|title': {
        categories: [
            {
                name: 'Tenure for Quality',
                solutions: [
                    { title: 'Link tenure regularization to upgrading', desc: 'Combine land titling with conditional requirements and incentives for housing quality improvements.' },
                    { title: 'Create occupancy permits for informal settlements', desc: 'Issue intermediate tenure documents that enable access to services and improvement finance.' },
                ],
            },
        ],
    },
    // ======================
    // GOVERNMENT - RURAL
    // ======================
    'government|rural|quantitative|supply|land': {
        categories: [
            {
                name: 'Rural Land Reform',
                solutions: [
                    { title: 'Clarify rural land tenure systems', desc: 'Harmonize customary and statutory land rights to unlock land for housing development.' },
                    { title: 'Create rural housing site plans', desc: 'Develop serviced site programs in growth centers to guide orderly rural housing development.' },
                    { title: 'Support community-based land management', desc: 'Empower local authorities to allocate and manage land for housing within traditional systems.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|supply|materials': {
        categories: [
            {
                name: 'Local Material Solutions',
                solutions: [
                    { title: 'Develop local building material supply chains', desc: 'Support production of materials near rural housing sites to reduce transport costs.' },
                    { title: 'Promote earth-based and natural building materials', desc: 'Research and standardize locally-available materials like compressed earth blocks, bamboo, and timber.' },
                    { title: 'Create rural material distribution centers', desc: 'Establish regional depots that aggregate demand and offer affordable materials in underserved areas.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|supply|labor': {
        categories: [
            {
                name: 'Rural Construction Workforce',
                solutions: [
                    { title: 'Create mobile construction training programs', desc: 'Deploy training teams to rural areas to build local construction capacity.' },
                    { title: 'Support self-build and mutual-aid housing', desc: 'Provide technical guidance and coordination for community-led construction efforts.' },
                    { title: 'Train local artisans in disaster-resilient building', desc: 'Equip rural builders with skills for climate-appropriate and seismically safe construction.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|supply|regulatory': {
        categories: [
            {
                name: 'Appropriate Rural Regulation',
                solutions: [
                    { title: 'Develop simplified rural building codes', desc: 'Create context-appropriate standards for rural housing that ensure safety without urban-level complexity.' },
                    { title: 'Decentralize building approvals', desc: 'Empower local governments to issue permits efficiently for standard rural housing types.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|supply|infrastructure': {
        categories: [
            {
                name: 'Rural Infrastructure',
                solutions: [
                    { title: 'Invest in rural water and sanitation', desc: 'Prioritize basic services that enable adequate housing quality in rural growth centers.' },
                    { title: 'Develop off-grid energy solutions', desc: 'Support solar and other renewable energy systems for rural housing that cannot connect to the grid.' },
                    { title: 'Create rural road access programs', desc: 'Connect rural housing areas to economic opportunities through basic transport infrastructure.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|financing|income': {
        categories: [
            {
                name: 'Rural Housing Finance',
                solutions: [
                    { title: 'Develop agricultural-income-linked housing loans', desc: 'Create products with repayment schedules aligned to seasonal farming income.' },
                    { title: 'Support rural savings and credit cooperatives', desc: 'Strengthen community-based financial institutions to mobilize savings for housing.' },
                    { title: 'Enable remittance-based housing finance', desc: 'Create products that leverage diaspora remittances for rural housing investment.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|financing|interest_rates': {
        categories: [
            {
                name: 'Rural Lending Support',
                solutions: [
                    { title: 'Create rural housing loan guarantee programs', desc: 'Reduce perceived risk of rural lending to enable lower interest rates from financial institutions.' },
                    { title: 'Develop blended finance models', desc: 'Combine concessional public funds with commercial lending to bring down effective rates for rural borrowers.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|financing|mortgage_products': {
        categories: [
            {
                name: 'Tailored Rural Products',
                solutions: [
                    { title: 'Develop incremental housing finance products', desc: 'Small, repeated loans for progressive house construction suited to rural self-build patterns.' },
                    { title: 'Create land-as-collateral lending', desc: 'Enable rural landowners to leverage land value for housing finance, even without formal title.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|financing|subsidies': {
        categories: [
            {
                name: 'Rural Housing Subsidies',
                solutions: [
                    { title: 'Create rural housing construction grants', desc: 'Direct capital subsidies for low-income rural households to build or improve housing.' },
                    { title: 'Implement materials-based subsidy programs', desc: 'Provide building materials rather than cash transfers to ensure housing investment.' },
                ],
            },
        ],
    },
    'government|rural|quantitative|financing|title': {
        categories: [
            {
                name: 'Rural Tenure',
                solutions: [
                    { title: 'Implement community-based land registration', desc: 'Use participatory approaches to map and register rural land rights at low cost.' },
                    { title: 'Recognize customary land rights', desc: 'Create legal frameworks that formalize traditional tenure systems for collateral use.' },
                ],
            },
        ],
    },
    // Rural qualitative uses similar patterns
    'government|rural|qualitative|supply|land': {
        categories: [{ name: 'Rural Upgrading', solutions: [
            { title: 'Support in-situ rural housing improvement', desc: 'Help households upgrade existing homes on their land with technical guidance and material support.' },
            { title: 'Develop rural resettlement programs for hazard zones', desc: 'Plan voluntary relocation with improved housing for communities in flood-prone or unsafe areas.' },
        ]}],
    },
    'government|rural|qualitative|supply|materials': {
        categories: [{ name: 'Quality Improvement', solutions: [
            { title: 'Distribute quality roofing and wall materials', desc: 'Subsidize durable roofing and wall materials to replace temporary or hazardous components.' },
            { title: 'Train households in improved construction techniques', desc: 'Community education on weather-proofing, ventilation, and structural safety improvements.' },
        ]}],
    },
    'government|rural|qualitative|supply|labor': {
        categories: [{ name: 'Rural Skills', solutions: [
            { title: 'Train village-level housing improvement advisors', desc: 'Create a cadre of community-based technical advisors who can guide safe home improvements.' },
        ]}],
    },
    'government|rural|qualitative|supply|regulatory': {
        categories: [{ name: 'Standards', solutions: [
            { title: 'Develop context-appropriate rural housing standards', desc: 'Set minimum habitability standards appropriate for rural contexts, focusing on safety and health.' },
        ]}],
    },
    'government|rural|qualitative|supply|infrastructure': {
        categories: [{ name: 'Basic Services', solutions: [
            { title: 'Extend water and sanitation to rural homes', desc: 'Prioritize household connections or community water points and improved sanitation facilities.' },
            { title: 'Support community-led infrastructure improvement', desc: 'Fund and guide community self-help projects for roads, drainage, and public facilities.' },
        ]}],
    },
    'government|rural|qualitative|financing|income': {
        categories: [{ name: 'Micro-Finance', solutions: [
            { title: 'Create rural home improvement microloans', desc: 'Small, flexible loans for specific improvements like roofing, flooring, or sanitation.' },
        ]}],
    },
    'government|rural|qualitative|financing|interest_rates': {
        categories: [{ name: 'Affordable Lending', solutions: [
            { title: 'Subsidize interest rates for rural housing improvement', desc: 'Government interest rate buy-downs for small housing improvement loans in rural areas.' },
        ]}],
    },
    'government|rural|qualitative|financing|mortgage_products': {
        categories: [{ name: 'Products', solutions: [
            { title: 'Develop micro-improvement loan products', desc: 'Small, short-term loans specifically for housing quality improvements in rural areas.' },
        ]}],
    },
    'government|rural|qualitative|financing|subsidies': {
        categories: [{ name: 'Grants', solutions: [
            { title: 'Create conditional home improvement grants', desc: 'Grants tied to meeting minimum safety and habitability standards, with technical oversight.' },
        ]}],
    },
    'government|rural|qualitative|financing|title': {
        categories: [{ name: 'Tenure', solutions: [
            { title: 'Link tenure security to housing improvement', desc: 'Combine land documentation with incentives and support for housing quality upgrades.' },
        ]}],
    },

    // ======================
    // BANK / FINANCIAL INSTITUTION
    // ======================
    'bank|urban|quantitative|supply|land': {
        categories: [
            {
                name: 'Developer Finance',
                solutions: [
                    { title: 'Create land acquisition financing products', desc: 'Offer structured land banking loans to developers assembling sites for housing projects.' },
                    { title: 'Finance serviced land development', desc: 'Provide project finance for converting raw land to serviced plots ready for housing construction.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|supply|materials': {
        categories: [
            {
                name: 'Supply Chain Finance',
                solutions: [
                    { title: 'Offer construction material supply chain finance', desc: 'Provide working capital and trade finance to building material suppliers and distributors.' },
                    { title: 'Finance prefabrication facilities', desc: 'Provide equipment and facility loans for companies investing in modern construction technology.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|supply|labor': {
        categories: [
            {
                name: 'Construction Sector Lending',
                solutions: [
                    { title: 'Finance construction workforce training', desc: 'Provide loans to construction companies investing in workforce development and training programs.' },
                    { title: 'Support technology-driven construction firms', desc: 'Offer preferential financing for companies adopting labor-saving construction technologies.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|supply|regulatory': {
        categories: [
            {
                name: 'Risk Management',
                solutions: [
                    { title: 'Develop risk-adjusted construction lending', desc: 'Create lending products that account for regulatory timelines and approval uncertainties.' },
                    { title: 'Advocate for regulatory reform', desc: 'Engage with government through industry associations to push for streamlined approvals that reduce project risk.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|supply|infrastructure': {
        categories: [
            {
                name: 'Infrastructure Finance',
                solutions: [
                    { title: 'Finance housing infrastructure projects', desc: 'Provide project finance for trunk infrastructure needed to unlock land for housing development.' },
                    { title: 'Create municipal infrastructure bonds', desc: 'Structure and distribute bonds to finance urban infrastructure needed for housing growth.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|financing|income': {
        categories: [
            {
                name: 'Inclusive Lending',
                solutions: [
                    { title: 'Develop alternative credit scoring models', desc: 'Use utility payments, mobile money history, and psychometric data to assess creditworthiness of informal earners.' },
                    { title: 'Create housing microfinance products', desc: 'Offer small, incremental housing loans with flexible repayment terms for lower-income clients.' },
                    { title: 'Design employer-assisted housing programs', desc: 'Partner with large employers to offer payroll-deducted housing loans for their workforce.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|financing|interest_rates': {
        categories: [
            {
                name: 'Funding & Capital Markets',
                solutions: [
                    { title: 'Access long-term funding sources', desc: 'Issue covered bonds, access DFI credit lines, or tap pension funds for affordable long-term housing finance.' },
                    { title: 'Develop mortgage securitization capability', desc: 'Build internal capacity to pool and securitize mortgages, freeing capital for new lending.' },
                    { title: 'Create fixed-rate mortgage products', desc: 'Offer interest rate certainty to borrowers through hedging and long-term funding management.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|financing|mortgage_products': {
        categories: [
            {
                name: 'Product Innovation',
                solutions: [
                    { title: 'Launch graduated payment mortgages', desc: 'Create products where payments start low and increase over time, matching expected income growth.' },
                    { title: 'Develop shared equity products', desc: 'Partner with government or DFIs to offer equity-sharing arrangements that lower entry barriers.' },
                    { title: 'Create Sharia-compliant housing products', desc: 'Develop Ijara, Murabaha, and diminishing Musharaka products to serve Muslim populations.' },
                    { title: 'Offer rent-to-own products', desc: 'Create lease-purchase arrangements that gradually transition renters into homeowners.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|financing|subsidies': {
        categories: [
            {
                name: 'Public-Private Collaboration',
                solutions: [
                    { title: 'Partner with government subsidy programs', desc: 'Become an accredited lender for public housing subsidies, combining grants with commercial finance.' },
                    { title: 'Create blended finance structures', desc: 'Combine concessional DFI funding with commercial lending to offer below-market rates for affordable housing.' },
                ],
            },
        ],
    },
    'bank|urban|quantitative|financing|title': {
        categories: [
            {
                name: 'Collateral Innovation',
                solutions: [
                    { title: 'Accept alternative forms of collateral', desc: 'Develop lending products secured by alternative documentation, employer guarantees, or group guarantees.' },
                    { title: 'Support digital property registration', desc: 'Partner with government to facilitate quick, verifiable property registration for loan processing.' },
                ],
            },
        ],
    },
    // Bank rural and qualitative - provide generalized solutions
    'bank|rural|quantitative|supply|land': { categories: [{ name: 'Rural Development Finance', solutions: [{ title: 'Finance rural land development projects', desc: 'Provide structured project finance for serviced-site developments in rural growth centers.' }]}] },
    'bank|rural|quantitative|supply|materials': { categories: [{ name: 'Supply Chain', solutions: [{ title: 'Finance rural building material distribution', desc: 'Provide working capital loans to distributors serving rural markets with quality building materials.' }]}] },
    'bank|rural|quantitative|supply|labor': { categories: [{ name: 'Construction Lending', solutions: [{ title: 'Finance rural construction enterprises', desc: 'Provide business loans to local construction firms serving rural housing markets.' }]}] },
    'bank|rural|quantitative|supply|regulatory': { categories: [{ name: 'Advocacy', solutions: [{ title: 'Support simplified rural building standards', desc: 'Advocate through industry groups for context-appropriate regulations that reduce lending risk in rural areas.' }]}] },
    'bank|rural|quantitative|supply|infrastructure': { categories: [{ name: 'Infrastructure', solutions: [{ title: 'Finance rural housing infrastructure', desc: 'Provide project finance for basic infrastructure needed to enable rural housing development.' }]}] },
    'bank|rural|quantitative|financing|income': { categories: [{ name: 'Rural Finance', solutions: [{ title: 'Create agricultural-income housing loans', desc: 'Design products with seasonal repayment aligned to harvest cycles and agricultural income patterns.' }, { title: 'Partner with agricultural cooperatives', desc: 'Use cooperative membership and performance data to underwrite housing loans for farmers.' }]}] },
    'bank|rural|quantitative|financing|interest_rates': { categories: [{ name: 'Risk Mitigation', solutions: [{ title: 'Access guarantee facilities for rural lending', desc: 'Use DFI and government guarantees to reduce risk premiums on rural housing loans.' }]}] },
    'bank|rural|quantitative|financing|mortgage_products': { categories: [{ name: 'Rural Products', solutions: [{ title: 'Develop incremental rural housing loans', desc: 'Create small, repeated loans for progressive house construction suited to rural building patterns.' }]}] },
    'bank|rural|quantitative|financing|subsidies': { categories: [{ name: 'Subsidy Channels', solutions: [{ title: 'Channel government rural housing subsidies', desc: 'Partner with government to distribute and complement housing subsidies with commercial lending.' }]}] },
    'bank|rural|quantitative|financing|title': { categories: [{ name: 'Collateral', solutions: [{ title: 'Develop alternative collateral models for rural lending', desc: 'Accept crop liens, livestock, equipment, or group guarantees as security for rural housing loans.' }]}] },
    // Bank qualitative
    'bank|urban|qualitative|supply|land': { categories: [{ name: 'Upgrading Finance', solutions: [{ title: 'Finance urban renewal and upgrading projects', desc: 'Provide project finance for developers undertaking housing renovation and neighborhood upgrading.' }]}] },
    'bank|urban|qualitative|supply|materials': { categories: [{ name: 'Improvement Finance', solutions: [{ title: 'Finance building material for home improvement', desc: 'Offer material-linked loans where funds go directly to approved suppliers for quality materials.' }]}] },
    'bank|urban|qualitative|supply|labor': { categories: [{ name: 'Skills Investment', solutions: [{ title: 'Finance renovation contractor businesses', desc: 'Provide business loans to companies specializing in housing renovation and improvement.' }]}] },
    'bank|urban|qualitative|supply|regulatory': { categories: [{ name: 'Compliance', solutions: [{ title: 'Finance retrofitting for code compliance', desc: 'Create loan products specifically for bringing existing properties up to current building standards.' }]}] },
    'bank|urban|qualitative|supply|infrastructure': { categories: [{ name: 'Service Finance', solutions: [{ title: 'Finance household-level infrastructure connections', desc: 'Offer loans for water, sanitation, and electricity connections bundled with home improvement.' }]}] },
    'bank|urban|qualitative|financing|income': { categories: [{ name: 'Micro-Improvement', solutions: [{ title: 'Create micro home improvement loans', desc: 'Small, short-term loans for specific improvements like roofing, plumbing, or structural reinforcement.' }]}] },
    'bank|urban|qualitative|financing|interest_rates': { categories: [{ name: 'Green Finance', solutions: [{ title: 'Offer green renovation financing', desc: 'Access climate finance and green bonds to offer favorable rates for energy-efficient housing improvements.' }]}] },
    'bank|urban|qualitative|financing|mortgage_products': { categories: [{ name: 'Renovation Products', solutions: [{ title: 'Bundle renovation loans with existing mortgages', desc: 'Offer top-up products that finance improvements alongside existing housing finance obligations.' }]}] },
    'bank|urban|qualitative|financing|subsidies': { categories: [{ name: 'Co-Financing', solutions: [{ title: 'Co-finance government upgrading programs', desc: 'Partner with public upgrading programs to provide complementary commercial finance to beneficiaries.' }]}] },
    'bank|urban|qualitative|financing|title': { categories: [{ name: 'Title Support', solutions: [{ title: 'Offer title-linked improvement loans', desc: 'Provide improvement financing conditional on property registration, supporting tenure formalization.' }]}] },
    'bank|rural|qualitative|supply|land': { categories: [{ name: 'Rural Upgrading', solutions: [{ title: 'Finance rural housing improvement programs', desc: 'Create lending products for rural home improvements, working with local technical assistance providers.' }]}] },
    'bank|rural|qualitative|supply|materials': { categories: [{ name: 'Materials', solutions: [{ title: 'Finance rural material supply chains', desc: 'Provide working capital to suppliers distributing quality improvement materials in rural areas.' }]}] },
    'bank|rural|qualitative|supply|labor': { categories: [{ name: 'Skills', solutions: [{ title: 'Finance rural renovation enterprises', desc: 'Business loans for artisans and small contractors specializing in rural housing improvements.' }]}] },
    'bank|rural|qualitative|supply|regulatory': { categories: [{ name: 'Standards', solutions: [{ title: 'Support compliance-linked lending', desc: 'Tie improvement loans to meeting basic safety and habitability standards with third-party verification.' }]}] },
    'bank|rural|qualitative|supply|infrastructure': { categories: [{ name: 'Services', solutions: [{ title: 'Finance rural service connections', desc: 'Offer bundled loans for water, sanitation, and energy improvements alongside housing upgrades.' }]}] },
    'bank|rural|qualitative|financing|income': { categories: [{ name: 'Micro-Finance', solutions: [{ title: 'Create micro-improvement loans for rural households', desc: 'Very small loans for critical home improvements with flexible repayment terms.' }]}] },
    'bank|rural|qualitative|financing|interest_rates': { categories: [{ name: 'Concessional Finance', solutions: [{ title: 'Access concessional funds for rural improvement lending', desc: 'Use DFI and climate finance facilities to offer below-market rates for rural housing improvement.' }]}] },
    'bank|rural|qualitative|financing|mortgage_products': { categories: [{ name: 'Products', solutions: [{ title: 'Develop graduated rural improvement products', desc: 'Small initial loans that grow as improvements are completed and household capacity increases.' }]}] },
    'bank|rural|qualitative|financing|subsidies': { categories: [{ name: 'Partnerships', solutions: [{ title: 'Partner with NGO upgrading programs', desc: 'Combine commercial micro-loans with NGO grants and technical assistance for rural housing improvement.' }]}] },
    'bank|rural|qualitative|financing|title': { categories: [{ name: 'Collateral', solutions: [{ title: 'Accept improvement-linked alternative collateral', desc: 'Use community guarantees or future property value increases as security for improvement loans.' }]}] },

    // ======================
    // DEVELOPER / BUILDER
    // ======================
    'developer|urban|quantitative|supply|land': {
        categories: [
            {
                name: 'Land Acquisition Strategies',
                solutions: [
                    { title: 'Form land banking partnerships', desc: 'Create joint ventures with landowners, offering profit-sharing instead of upfront land purchase.' },
                    { title: 'Target government land disposition programs', desc: 'Engage early with public land release processes and meet affordable housing requirements to access below-market land.' },
                    { title: 'Pursue brownfield redevelopment', desc: 'Acquire and remediate former industrial or commercial sites for residential conversion at lower land costs.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|supply|materials': {
        categories: [
            {
                name: 'Cost Reduction',
                solutions: [
                    { title: 'Invest in prefabrication and modular systems', desc: 'Reduce material waste and cost through factory-based production of housing components.' },
                    { title: 'Form bulk purchasing cooperatives', desc: 'Collaborate with other developers to achieve volume discounts on key building materials.' },
                    { title: 'Adopt alternative building technologies', desc: 'Use cost-effective methods like EPS panels, light steel framing, or compressed earth blocks.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|supply|labor': {
        categories: [
            {
                name: 'Workforce Solutions',
                solutions: [
                    { title: 'Create in-house training programs', desc: 'Develop internal apprenticeship programs to build a reliable skilled workforce.' },
                    { title: 'Adopt labor-efficient construction methods', desc: 'Use prefab, modular, or panelized systems that reduce on-site labor requirements by 30-50%.' },
                    { title: 'Implement digital construction management', desc: 'Use BIM, scheduling software, and real-time tracking to maximize labor productivity on site.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|supply|regulatory': {
        categories: [
            {
                name: 'Navigating Regulations',
                solutions: [
                    { title: 'Engage early with planning authorities', desc: 'Pre-application consultations and design reviews to minimize approval delays and costly redesigns.' },
                    { title: 'Use standardized, pre-approved designs', desc: 'Develop typological house plans that have pre-approval status, speeding up the permitting process.' },
                    { title: 'Advocate collectively for reform', desc: 'Join developer associations to push for streamlined approvals, digital permitting, and reasonable standards.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|supply|infrastructure': {
        categories: [
            {
                name: 'Infrastructure Solutions',
                solutions: [
                    { title: 'Negotiate infrastructure cost-sharing with government', desc: 'Structure deals where public infrastructure is co-financed through development levies and phased investment.' },
                    { title: 'Invest in on-site infrastructure systems', desc: 'Use decentralized water, waste, and energy systems to reduce dependency on trunk infrastructure.' },
                    { title: 'Phase development to match infrastructure delivery', desc: 'Plan project phases to align with government infrastructure rollout schedules.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|financing|income': {
        categories: [
            {
                name: 'Affordable Product Design',
                solutions: [
                    { title: 'Design for affordability from inception', desc: 'Use target-cost design approaches, optimizing unit sizes and specifications for the income segment.' },
                    { title: 'Create rent-to-own housing models', desc: 'Build rental stock with purchase options, enabling gradual homeownership for lower-income households.' },
                    { title: 'Partner with employers for workforce housing', desc: 'Develop housing near major employers with payroll-deduction purchase or rental agreements.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|financing|interest_rates': {
        categories: [
            {
                name: 'Financial Structuring',
                solutions: [
                    { title: 'Access DFI construction finance', desc: 'Tap development finance institutions for lower-cost project finance dedicated to affordable housing.' },
                    { title: 'Structure pre-sales to reduce financing needs', desc: 'Use off-plan sales with milestone payments to reduce construction financing requirements and costs.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|financing|mortgage_products': {
        categories: [
            {
                name: 'End-User Finance',
                solutions: [
                    { title: 'Partner with financial institutions on buyer finance', desc: 'Pre-arrange mortgage facilities for buyers, reducing sales risk and accelerating absorption.' },
                    { title: 'Offer developer finance / installment plans', desc: 'Provide direct purchase installment plans for buyers who cannot access traditional mortgages.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|financing|subsidies': {
        categories: [
            {
                name: 'Subsidy Access',
                solutions: [
                    { title: 'Design projects to qualify for government subsidies', desc: 'Ensure unit sizes, prices, and specifications meet subsidy program criteria to expand the buyer pool.' },
                    { title: 'Access affordable housing tax incentives', desc: 'Structure projects to qualify for tax credits, VAT exemptions, or other fiscal incentives for affordable housing.' },
                ],
            },
        ],
    },
    'developer|urban|quantitative|financing|title': {
        categories: [
            {
                name: 'Title Solutions',
                solutions: [
                    { title: 'Ensure clean title before development', desc: 'Invest in thorough due diligence and title clearance to avoid delays and enable buyer financing.' },
                    { title: 'Facilitate buyer title registration', desc: 'Bundle title registration services into the purchase process to ensure buyers get bankable documentation.' },
                ],
            },
        ],
    },
    // Developer rural
    'developer|rural|quantitative|supply|land': { categories: [{ name: 'Rural Land', solutions: [{ title: 'Partner with communities for land access', desc: 'Negotiate community land use agreements for housing development in rural growth centers.' }, { title: 'Develop serviced site projects', desc: 'Create basic serviced plots with core housing units that buyers can expand incrementally.' }]}] },
    'developer|rural|quantitative|supply|materials': { categories: [{ name: 'Local Materials', solutions: [{ title: 'Use locally-sourced materials', desc: 'Design housing systems that maximize use of local materials to reduce costs and logistics challenges.' }]}] },
    'developer|rural|quantitative|supply|labor': { categories: [{ name: 'Labor', solutions: [{ title: 'Train and employ local labor', desc: 'Build local construction capacity through on-the-job training programs that benefit the community.' }]}] },
    'developer|rural|quantitative|supply|regulatory': { categories: [{ name: 'Approvals', solutions: [{ title: 'Work with local authorities on approvals', desc: 'Engage rural local governments early to navigate simplified approval processes.' }]}] },
    'developer|rural|quantitative|supply|infrastructure': { categories: [{ name: 'Infrastructure', solutions: [{ title: 'Design for off-grid and minimal infrastructure', desc: 'Use solar power, rainwater harvesting, and eco-sanitation to reduce infrastructure dependencies.' }]}] },
    'developer|rural|quantitative|financing|income': { categories: [{ name: 'Affordability', solutions: [{ title: 'Design starter homes for rural incomes', desc: 'Create expandable core units at price points accessible to rural households.' }]}] },
    'developer|rural|quantitative|financing|interest_rates': { categories: [{ name: 'Finance', solutions: [{ title: 'Access concessional construction finance', desc: 'Source DFI or impact investor funding for rural affordable housing projects.' }]}] },
    'developer|rural|quantitative|financing|mortgage_products': { categories: [{ name: 'Buyer Finance', solutions: [{ title: 'Offer direct installment payment plans', desc: 'Provide flexible payment plans directly to rural buyers who lack access to formal mortgages.' }]}] },
    'developer|rural|quantitative|financing|subsidies': { categories: [{ name: 'Subsidies', solutions: [{ title: 'Access rural housing subsidy programs', desc: 'Design projects to qualify for government rural housing subsidies and grants.' }]}] },
    'developer|rural|quantitative|financing|title': { categories: [{ name: 'Title', solutions: [{ title: 'Facilitate land documentation for buyers', desc: 'Include title registration in the development process to provide buyers with secure, bankable tenure.' }]}] },
    // Developer qualitative
    'developer|urban|qualitative|supply|land': { categories: [{ name: 'Redevelopment', solutions: [{ title: 'Pursue urban infill and redevelopment', desc: 'Target underutilized urban land for quality housing that replaces deteriorated stock.' }]}] },
    'developer|urban|qualitative|supply|materials': { categories: [{ name: 'Quality Materials', solutions: [{ title: 'Use quality-certified building systems', desc: 'Adopt certified construction systems that guarantee structural quality and durability standards.' }]}] },
    'developer|urban|qualitative|supply|labor': { categories: [{ name: 'Quality Labor', solutions: [{ title: 'Invest in quality assurance systems', desc: 'Implement rigorous quality control with trained supervisors and standardized inspection protocols.' }]}] },
    'developer|urban|qualitative|supply|regulatory': { categories: [{ name: 'Compliance', solutions: [{ title: 'Exceed minimum building standards', desc: 'Differentiate through quality, using enhanced specifications that ensure durability and resident satisfaction.' }]}] },
    'developer|urban|qualitative|supply|infrastructure': { categories: [{ name: 'Services', solutions: [{ title: 'Deliver fully-serviced housing developments', desc: 'Include all basic infrastructure in the project scope to ensure complete, livable housing delivery.' }]}] },
    'developer|urban|qualitative|financing|income': { categories: [{ name: 'Affordability', solutions: [{ title: 'Design quality housing at affordable price points', desc: 'Use value engineering to deliver durable, well-serviced housing within reach of target buyers.' }]}] },
    'developer|urban|qualitative|financing|interest_rates': { categories: [{ name: 'Green Finance', solutions: [{ title: 'Access green building finance', desc: 'Qualify for green bond and climate finance by incorporating energy efficiency and sustainability features.' }]}] },
    'developer|urban|qualitative|financing|mortgage_products': { categories: [{ name: 'Buyer Finance', solutions: [{ title: 'Pre-arrange quality-linked mortgage products', desc: 'Partner with lenders to offer preferential mortgage terms for homes meeting quality certifications.' }]}] },
    'developer|urban|qualitative|financing|subsidies': { categories: [{ name: 'Incentives', solutions: [{ title: 'Access quality housing incentives', desc: 'Qualify for government incentives tied to green building, accessibility, or enhanced quality standards.' }]}] },
    'developer|urban|qualitative|financing|title': { categories: [{ name: 'Title', solutions: [{ title: 'Ensure complete documentation on delivery', desc: 'Provide full legal documentation including title, compliance certificates, and warranty on handover.' }]}] },
    'developer|rural|qualitative|supply|land': { categories: [{ name: 'Improvement', solutions: [{ title: 'Develop housing improvement product lines', desc: 'Create standardized renovation packages that rural homeowners can purchase for quality upgrades.' }]}] },
    'developer|rural|qualitative|supply|materials': { categories: [{ name: 'Materials', solutions: [{ title: 'Supply quality improvement kits', desc: 'Create pre-packaged material kits for common rural housing improvements like roofing or flooring.' }]}] },
    'developer|rural|qualitative|supply|labor': { categories: [{ name: 'Labor', solutions: [{ title: 'Deploy mobile renovation teams', desc: 'Send trained teams to rural areas to deliver housing improvement services at scale.' }]}] },
    'developer|rural|qualitative|supply|regulatory': { categories: [{ name: 'Standards', solutions: [{ title: 'Adopt voluntary quality standards', desc: 'Implement internal quality standards that exceed local requirements to build reputation and trust.' }]}] },
    'developer|rural|qualitative|supply|infrastructure': { categories: [{ name: 'Services', solutions: [{ title: 'Include service upgrades in improvement packages', desc: 'Bundle water, sanitation, and energy improvements with structural housing upgrades.' }]}] },
    'developer|rural|qualitative|financing|income': { categories: [{ name: 'Payment', solutions: [{ title: 'Offer flexible payment for improvement services', desc: 'Allow installment payments for housing improvement packages suited to rural income patterns.' }]}] },
    'developer|rural|qualitative|financing|interest_rates': { categories: [{ name: 'Finance', solutions: [{ title: 'Partner with MFIs for improvement finance', desc: 'Work with microfinance institutions to pre-arrange buyer financing for improvement services.' }]}] },
    'developer|rural|qualitative|financing|mortgage_products': { categories: [{ name: 'Products', solutions: [{ title: 'Create improvement finance bundles', desc: 'Package improvement services with pre-arranged micro-financing from partner institutions.' }]}] },
    'developer|rural|qualitative|financing|subsidies': { categories: [{ name: 'Grants', solutions: [{ title: 'Partner with NGOs and government programs', desc: 'Serve as implementation partner for publicly-funded rural housing improvement programs.' }]}] },
    'developer|rural|qualitative|financing|title': { categories: [{ name: 'Documentation', solutions: [{ title: 'Help clients document property rights', desc: 'Assist improvement clients with obtaining formal property documentation as part of the service.' }]}] },
};

// ---- Labels ----
const labels = {
    stakeholder: { government: 'Government', bank: 'Bank / Financial Institution', developer: 'Developer / Builder' },
    geography: { urban: 'Urban', rural: 'Rural' },
    deficitType: { quantitative: 'Quantitative Deficit', qualitative: 'Qualitative Deficit' },
    rootCause: { supply: 'Lack of Supply', financing: 'Lack of Financing / Demand Tools' },
    specificIssue: {
        land: 'Land Availability & Cost',
        materials: 'Construction Materials',
        labor: 'Skilled Labor Shortage',
        regulatory: 'Regulatory & Permitting Barriers',
        infrastructure: 'Infrastructure Deficits',
        income: 'Lack of Formal Income',
        interest_rates: 'High Interest Rates',
        mortgage_products: 'Insufficient Mortgage Products',
        subsidies: 'Lack of Subsidy Programs',
        title: 'Property Title & Registration',
    },
};

// ---- Navigation ----
function showStep(stepIndex) {
    STEPS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (i === stepIndex) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progress = stepIndex === 0 ? 0 : ((stepIndex - 1) / TOTAL_QUESTION_STEPS) * 100;
    progressFill.style.width = progress + '%';

    // Update step indicators
    document.querySelectorAll('.progress-steps .step').forEach((stepEl, i) => {
        const stepNum = i + 1;
        stepEl.classList.remove('active', 'completed');
        if (stepIndex === 0) return;
        if (stepNum < stepIndex) {
            stepEl.classList.add('completed');
        } else if (stepNum === stepIndex) {
            stepEl.classList.add('active');
        }
    });

    // Show/hide progress bar
    const progressBar = document.getElementById('progressBar');
    if (stepIndex === 0) {
        progressBar.style.display = 'none';
    } else {
        progressBar.style.display = 'block';
    }

    state.currentStep = stepIndex;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startDiagnostic() {
    state.answers = { stakeholder: null, geography: null, deficitType: null, rootCause: null, specificIssue: null };
    clearSelections();
    showStep(1);
}

function restartDiagnostic() {
    state.answers = { stakeholder: null, geography: null, deficitType: null, rootCause: null, specificIssue: null };
    clearSelections();
    showStep(0);
}

function clearSelections() {
    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
}

function goBack() {
    if (state.currentStep > 1) {
        showStep(state.currentStep - 1);
    }
}

// ---- Option Selection ----
function selectOption(field, value) {
    state.answers[field] = value;

    // Visual feedback
    const parentId = {
        stakeholder: 'stakeholderOptions',
        geography: 'geographyOptions',
        deficitType: 'deficitTypeOptions',
        rootCause: 'rootCauseOptions',
        specificIssue: 'specificIssueOptions',
    }[field];

    const parent = document.getElementById(parentId);
    parent.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    parent.querySelector(`[data-value="${value}"]`).classList.add('selected');

    // Auto-advance after brief delay
    setTimeout(() => {
        if (field === 'stakeholder') showStep(2);
        else if (field === 'geography') showStep(3);
        else if (field === 'deficitType') showStep(4);
        else if (field === 'rootCause') {
            populateSpecificIssues();
            showStep(5);
        }
        else if (field === 'specificIssue') {
            showResults();
            showStep(6);
        }
    }, 300);
}

// ---- Dynamic Step 5 ----
function populateSpecificIssues() {
    const container = document.getElementById('specificIssueOptions');
    const titleEl = document.getElementById('step5Title');
    const subtitleEl = document.getElementById('step5Subtitle');

    container.innerHTML = '';

    let issues;
    if (state.answers.rootCause === 'supply') {
        titleEl.textContent = 'What is the primary supply-side barrier?';
        subtitleEl.textContent = 'Identify the most critical constraint preventing housing production.';
        issues = supplyIssues;
    } else {
        titleEl.textContent = 'What is the primary financing / demand-side barrier?';
        subtitleEl.textContent = 'Identify the most critical barrier preventing people from accessing housing.';
        issues = financingIssues;
    }

    issues.forEach(issue => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.dataset.value = issue.value;
        btn.onclick = () => selectOption('specificIssue', issue.value);
        btn.innerHTML = `
            <div class="option-icon">${issue.icon}</div>
            <h3>${issue.title}</h3>
            <p>${issue.description}</p>
        `;
        container.appendChild(btn);
    });
}

// ---- Results ----
function showResults() {
    const { stakeholder, geography, deficitType, rootCause, specificIssue } = state.answers;

    // Build diagnosis summary
    const summaryEl = document.getElementById('diagnosisSummary');
    summaryEl.innerHTML = `
        <h3>Your Diagnosis Path</h3>
        <div class="diagnosis-path">
            <div class="diagnosis-tag"><span class="tag-label">Stakeholder</span> ${labels.stakeholder[stakeholder]}</div>
            <span class="diagnosis-arrow">&rarr;</span>
            <div class="diagnosis-tag"><span class="tag-label">Geography</span> ${labels.geography[geography]}</div>
            <span class="diagnosis-arrow">&rarr;</span>
            <div class="diagnosis-tag"><span class="tag-label">Deficit</span> ${labels.deficitType[deficitType]}</div>
            <span class="diagnosis-arrow">&rarr;</span>
            <div class="diagnosis-tag"><span class="tag-label">Root Cause</span> ${labels.rootCause[rootCause]}</div>
            <span class="diagnosis-arrow">&rarr;</span>
            <div class="diagnosis-tag"><span class="tag-label">Issue</span> ${labels.specificIssue[specificIssue]}</div>
        </div>
    `;

    // Look up solutions
    const key = `${stakeholder}|${geography}|${deficitType}|${rootCause}|${specificIssue}`;
    const solutionData = solutionsDatabase[key];

    const solutionsEl = document.getElementById('solutionsSection');

    if (!solutionData) {
        solutionsEl.innerHTML = `
            <h3>Recommended Solutions</h3>
            <p>No specific solutions found for this combination. Please try a different diagnostic path or contact a housing specialist for customized advice.</p>
        `;
        return;
    }

    let html = '<h3>Recommended Solutions</h3>';
    solutionData.categories.forEach(category => {
        html += `<div class="solution-category"><h4>${category.name}</h4><ul class="solution-list">`;
        category.solutions.forEach(solution => {
            html += `
                <li class="solution-item">
                    <div class="solution-check">&#10003;</div>
                    <div class="solution-text">
                        <strong>${solution.title}</strong>
                        <p>${solution.desc}</p>
                    </div>
                </li>
            `;
        });
        html += '</ul></div>';
    });

    solutionsEl.innerHTML = html;
}

function printResults() {
    window.print();
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    showStep(0);
});
