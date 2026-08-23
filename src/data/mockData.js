// FoodRescue V2 - Production Data & Algorithm Models

export const DEFAULT_DONORS = [
  {
    id: "donor_banquet",
    name: "Celebration Banquet & Party Hall",
    type: "BANQUET_HALL",
    role: "DONOR",
    categoryLabel: "🎉 Banquet & Party Hall",
    address: "Sector 29, Main City Corridor",
    phone: "+91 98220 54321",
    email: "manager@celebrationbanquet.com",
    dailyPrepared: 700,
    expectedDemand: 520,
    predictedSurplus: 180,
    avatar: "🎉",
    badge: "Verified Food Partner",
    rating: "4.9 ★ (120+ Rescues)",
    manager: "Rajesh Sharma (Operations Manager)"
  },
  {
    id: "donor_restaurant",
    name: "City Central Restaurant & Grill",
    type: "RESTAURANT",
    role: "DONOR",
    categoryLabel: "🍽️ Restaurant & Fine Dine",
    address: "Central Market, Block B",
    phone: "+91 98110 99887",
    email: "contact@citycentralgrill.in",
    dailyPrepared: 450,
    expectedDemand: 360,
    predictedSurplus: 90,
    avatar: "🍽️",
    badge: "Verified Food Partner",
    rating: "4.8 ★ (80 Rescues)",
    manager: "Anil Verma (Head Chef)"
  },
  {
    id: "donor_canteen",
    name: "University North Hostel Canteen",
    type: "COLLEGE_MESS",
    role: "DONOR",
    categoryLabel: "🎓 College & Hostel Mess",
    address: "University Campus, Hostel Block 3",
    phone: "+91 98440 33445",
    email: "mess.incharge@univ.edu.in",
    dailyPrepared: 550,
    expectedDemand: 460,
    predictedSurplus: 90,
    avatar: "🎓",
    badge: "Verified Food Partner",
    rating: "4.7 ★ (65 Rescues)",
    manager: "K. S. Rawat (Mess In-Charge)"
  },
  {
    id: "donor_society",
    name: "Palm Valley Residents Community",
    type: "HOUSEHOLD_SOCIETY",
    role: "DONOR",
    categoryLabel: "🏠 Society & Community Events",
    address: "Palm Valley Society Clubhouse, Sector 14",
    phone: "+91 98550 77889",
    email: "secretary@palmvalley.org",
    dailyPrepared: 60,
    expectedDemand: 35,
    predictedSurplus: 25,
    avatar: "🏠",
    badge: "Community Contributor",
    rating: "4.9 ★ (30 Rescues)",
    manager: "Sunita Gupta (Community Secretary)"
  }
];

export const DEFAULT_RECEIVERS = [
  {
    id: "ngo_1",
    name: "Hope Shelter & Food Bank",
    type: "EMERGENCY_SHELTER",
    role: "RECEIVER",
    categoryLabel: "Night Shelter & Community Food Bank",
    distanceKm: 2.4,
    distanceLabel: "2.4 km away (~8 mins)",
    currentNeedMeals: 150,
    pickupAvailable: true,
    pickupFleet: "2 Dedicated Rescue Vans Ready",
    rating: 4.9,
    verified: true,
    address: "Shelter Complex 4, Ring Road Corridor",
    contactPerson: "Vikas Kumar (Relief Coordinator)",
    phone: "+91 98765 43210",
    email: "help@hopeshelter.org",
    operatingHours: "24/7 Active",
    distributionFocus: "Homeless Individuals, Night Workers & Shelters"
  },
  {
    id: "ngo_2",
    name: "Robin Hood Army (Volunteer Network)",
    type: "VOLUNTEER_NETWORK",
    role: "RECEIVER",
    categoryLabel: "Volunteer Food Redistribution Network",
    distanceKm: 4.1,
    distanceLabel: "4.1 km away (~14 mins)",
    currentNeedMeals: 100,
    pickupAvailable: true,
    pickupFleet: "12 Volunteer Bikers with Insulated Boxes",
    rating: 4.9,
    verified: true,
    address: "Community Centre, Ward 12",
    contactPerson: "Simran Kaur",
    phone: "+91 98111 22334",
    email: "delhi@robinhoodarmy.com",
    operatingHours: "07:00 AM - 11:30 PM",
    distributionFocus: "Slum Clusters, Construction Laborers"
  },
  {
    id: "ngo_3",
    name: "Care & Share Community Kitchen",
    type: "COMMUNITY_KITCHEN",
    role: "RECEIVER",
    categoryLabel: "Slum Cluster Relief Center",
    distanceKm: 6.8,
    distanceLabel: "6.8 km away (~22 mins)",
    currentNeedMeals: 60,
    pickupAvailable: true,
    pickupFleet: "1 Mini Cargo Van",
    rating: 4.7,
    verified: true,
    address: "Sector 45 Slum Rehabilitation Block",
    contactPerson: "Mohd. Arif",
    phone: "+91 98990 88776",
    email: "careshare@gmail.com",
    operatingHours: "08:00 AM - 10:00 PM",
    distributionFocus: "Daily Wage Workers & Elderly"
  }
];

export const INITIAL_DONATIONS = [
  {
    id: "FR-2001",
    donorId: "donor_banquet",
    donorName: "Celebration Banquet & Party Hall",
    donorPhone: "+91 98220 54321",
    donorAddress: "Celebration Banquet, Sector 29 Main Road",
    foodType: "Paneer Butter Masala, Dal Makhani, Veg Pulao & Rotis",
    foodCategory: "Cooked Meal (Event Buffet)",
    quantity: 150,
    preparedAt: "08:30 PM",
    availableUntil: "12:30 AM",
    safeHoursRemaining: 3.5,
    urgencyScore: 92,
    urgencyLevel: "HIGH",
    temperature: "68°C (Hot Preserved)",
    packaging: "Sealed Stainless Steel Thermal Containers",
    status: "AVAILABLE", // AVAILABLE -> ACCEPTED -> COLLECTED -> DISTRIBUTED -> COMPLETED
    matchedNgoId: null,
    matchedNgoName: null,
    driverName: null,
    driverPhone: null,
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    collectedAt: null,
    distributedAt: null,
    notes: "Freshly cooked dinner buffet surplus. Clean stainless steel containers."
  },
  {
    id: "FR-2002",
    donorId: "donor_restaurant",
    donorName: "City Central Restaurant & Grill",
    donorPhone: "+91 98110 99887",
    donorAddress: "Central Market, Block B",
    foodType: "Biryani, Shahi Gravy, Parathas & Gulab Jamun",
    foodCategory: "Restaurant Cooked Food",
    quantity: 80,
    preparedAt: "09:00 PM",
    availableUntil: "01:00 AM",
    safeHoursRemaining: 4.0,
    urgencyScore: 85,
    urgencyLevel: "HIGH",
    temperature: "64°C",
    packaging: "Heavy-Duty Food Grade Foil Trays",
    status: "ACCEPTED",
    matchedNgoId: "ngo_1",
    matchedNgoName: "Hope Shelter & Food Bank",
    driverName: "Vikas Kumar (Rescue Van 02)",
    driverPhone: "+91 98765 43210",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    collectedAt: null,
    distributedAt: null,
    notes: "Hot packaged biryani ready at back kitchen dispatch gate."
  },
  {
    id: "FR-2003",
    donorId: "donor_canteen",
    donorName: "University North Hostel Canteen",
    donorPhone: "+91 98440 33445",
    donorAddress: "University Campus, Hostel Block 3",
    foodType: "Rajma Chawal, Mixed Veg & Roti",
    foodCategory: "Hostel Mess Batch",
    quantity: 65,
    preparedAt: "07:30 PM",
    availableUntil: "10:30 PM",
    safeHoursRemaining: 2.0,
    urgencyScore: 78,
    urgencyLevel: "MEDIUM",
    temperature: "58°C",
    packaging: "Insulated Food Crates",
    status: "COLLECTED",
    matchedNgoId: "ngo_2",
    matchedNgoName: "Robin Hood Army (Volunteer Network)",
    driverName: "Aman Sharma (Bike Volunteer)",
    driverPhone: "+91 98111 44556",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    collectedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    distributedAt: null,
    notes: "Food picked up and currently on bike transport towards Slum Ward 12."
  },
  {
    id: "FR-1999",
    donorId: "donor_banquet",
    donorName: "Celebration Banquet & Party Hall",
    donorPhone: "+91 98220 54321",
    donorAddress: "Celebration Banquet, Sector 29 Main Road",
    foodType: "Paneer Tikka, Jeera Rice, Dal Tadka & Naan",
    foodCategory: "Cooked Meal (Event Buffet)",
    quantity: 180,
    preparedAt: "01:00 PM",
    availableUntil: "05:00 PM",
    safeHoursRemaining: 0,
    urgencyScore: 90,
    urgencyLevel: "HIGH",
    temperature: "Room Temp",
    packaging: "Thermal Boxes",
    status: "COMPLETED",
    matchedNgoId: "ngo_1",
    matchedNgoName: "Hope Shelter & Food Bank",
    driverName: "Vikas Kumar (Rescue Van 01)",
    driverPhone: "+91 98765 43210",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
    collectedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    distributedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    notes: "Safely distributed to 180 night shelter residents."
  }
];

export const INITIAL_CHAT_MESSAGES = {
  "FR-2002": [
    {
      id: "msg_1",
      senderRole: "DONOR",
      senderName: "City Central Restaurant",
      text: "Namaste! Food is ready and packed in 4 heavy foil trays at our back delivery gate.",
      timestamp: "09:12 PM"
    },
    {
      id: "msg_2",
      senderRole: "RECEIVER",
      senderName: "Hope Shelter",
      text: "Thanks! Our rescue van #02 is on the way, ETA is ~8 minutes.",
      timestamp: "09:14 PM"
    }
  ],
  "FR-2003": [
    {
      id: "msg_3",
      senderRole: "DONOR",
      senderName: "Hostel Canteen",
      text: "Please come to Hostel Block 3 gate.",
      timestamp: "08:15 PM"
    },
    {
      id: "msg_4",
      senderRole: "RECEIVER",
      senderName: "Robin Hood Army",
      text: "Volunteer has collected the food. Heading to distribution spot now!",
      timestamp: "08:35 PM"
    }
  ]
};

export const FOOD_TEMPLATES = [
  {
    id: "preset_1",
    title: "🎉 Banquet Wedding Surplus",
    donorType: "BANQUET_HALL",
    foodType: "Shahi Paneer, Dal Makhani, Pulao, Butter Naan & Gulab Jamun",
    quantity: 150,
    foodCategory: "Cooked Meal (Event Buffet)",
    preparedAt: "08:30 PM",
    availableUntil: "12:30 AM",
    location: "Celebration Banquet, Sector 29 Main Road",
    notes: "Kept hot in stainless steel chafing dishes. Ready for immediate pickup."
  },
  {
    id: "preset_2",
    title: "🍽️ Restaurant Buffet Leftover",
    donorType: "RESTAURANT",
    foodType: "Chicken Biryani, Veg Gravy, Raita & Assorted Breads",
    quantity: 80,
    foodCategory: "Restaurant Cooked Food",
    preparedAt: "09:15 PM",
    availableUntil: "01:15 AM",
    location: "City Central Restaurant, Block B Market",
    notes: "Food grade foil tray packaging. Refrigerated until dispatch."
  },
  {
    id: "preset_3",
    title: "🎓 Hostel Dinner Surplus",
    donorType: "COLLEGE_MESS",
    foodType: "Rajma Masala, Steamed Rice, Mix Veg & Phulkas",
    quantity: 60,
    foodCategory: "Hostel Mess Batch",
    preparedAt: "08:00 PM",
    availableUntil: "11:00 PM",
    location: "University Campus, North Hostel Block",
    notes: "Cooked fresh at 8 PM. Suitable for immediate dinner redistribution."
  }
];

export function calculateUrgency(donation) {
  const qty = Number(donation.quantity) || 50;
  let score = 50;
  if (qty >= 120) score += 25;
  else if (qty >= 70) score += 15;
  else score += 5;

  if (donation.foodCategory?.includes('Cooked') || donation.foodCategory?.includes('Buffet')) {
    score += 20;
  } else {
    score += 10;
  }

  score = Math.min(score, 98);
  const level = score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'NORMAL';

  return {
    score,
    level,
    estimatedSafeHours: qty > 100 ? '3h 30m' : '4h 15m'
  };
}

export function calculateMatchScore(donation, receiver) {
  const dist = receiver.distanceKm || 3;
  const distScore = Math.max(0, 100 - (dist * 12));
  const need = receiver.currentNeedMeals || 100;
  const qty = Number(donation.quantity) || 80;
  const demandDiff = Math.abs(need - qty);
  const capacityScore = Math.max(20, 100 - (demandDiff * 0.8));
  const urgencyWeight = (donation.urgencyScore || 80);
  const logisticsScore = receiver.pickupAvailable ? 95 : 60;

  const totalScore = Math.round(
    (distScore * 0.30) +
    (capacityScore * 0.30) +
    (urgencyWeight * 0.20) +
    (logisticsScore * 0.20)
  );

  return Math.min(99, Math.max(65, totalScore));
}
