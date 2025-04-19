export interface Question {
  id: number;
  question: string;
  answer: string;
  inputFields?: number;
  acceptableAnswers?: string[];
  prefilledAnswers?: { [key: number]: string };
  displayFormat?: 'hierarchy';
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What safety feature on the Order Picking Forklift must be closed at all times when operating?",
    answer: "Handrail",
    acceptableAnswers: [
      "Handrail"
    ],
    inputFields: 1
  },
  {
    id: 2,
    question: "What are three (3) documented sources you could refer to for workplace safety information?",
    answer: "Work Health and Safety Act 2012 (SA); Work Health and Safety Regulations 2012 (SA); Codes of Practice; Australian Standards; WHS policy and procedures; Safe working procedures; Management plans; Manufacturer’s specifications",
    acceptableAnswers: [
      "Work Health and Safety Act 2012 (SA)",
      "Work Health and Safety Regulations 2012 (SA)",
      "Codes of Practice",
      "Australian Standards",
      "WHS policy and procedures",
      "Safe working procedures",
      "Management plans",
      "Manufacturer’s specifications"
    ],
    inputFields: 3
  },
  {
    id: 3,
    question: "What are three (3) duties a PCBU should take to ensure the health and safety of a worker?",
    answer: "Provide and maintain a work environment without risks to health and safety; Provide and maintain safe plant and structures, Provide and maintain safe systems of work; Provide and maintain adequate facilities; Provide and maintain any information, training, instruction or supervision for the work to be undertaken safely; Provide and maintain procedures and systems to ensure the safe use, handling and storage of plant, structures and substances; Provide and maintain monitoring of health for workers and the conditions at the workplace to prevent illness or injury",
    acceptableAnswers: [
      "Provide and maintain safe plant and structures",
      "Provide and maintain safe systems of work",
      "Provide and maintain adequate facilities",
      "Provide and maintain a work environment without risks to health and safety",
      "Provide and maintain any information, training, instruction or supervision for the work to be undertaken safely",
      "Provide and maintain procedures and systems to ensure the safe use, handling and storage of plant, structures and substances",
      "Provide and maintain monitoring of health for workers and the conditions at the workplace to prevent illness or injury"
    ],
    inputFields: 3
  },
  {
    id: 4,
    question: "After successfully obtaining your High Risk Work Licence, list two (2) things your employer must provide prior to you before operating an unfamiliar Order Picking Forklift.",
    answer: "Information; Training; Instruction; Supervision",
    acceptableAnswers: [
      "Information",
      "Training",
      "Instruction",
      "Supervision"
    ],
    inputFields: 2
  },
  {
    id: 5,
    question: "What does the Duty of Care as a worker involve? List two (2) responsibilities",
    answer: "Take reasonable care for your own health and safety; Take reasonable care for the health and safety of others",
    acceptableAnswers: [
      "Take reasonable care for your own health and safety",
      "Take reasonable care for the health and safety of others who may be affected by their own acts or omissions",
      "Cooperate with anything the employer does to comply with WHS requirements",
      "Not intentionally or recklessly interfere with or misuse anything provided at the workplace for WHS"
    ],
    inputFields: 2
  }
  {
    id: 6,
    question: "What are two (2) actions the Work Health and Safety Regulator could do if it is found that you were not working safely as a High Risk Work Licence holder?",
    answer: "Suspend their HRW licence; Cancel their HRW licence; Refuse to renew HRW licence",
    acceptableAnswers: [
      "Suspend their HRW licence",
      "Cancel their HRW licence",
      "Refuse to renew HRW licence",
      "Direct reassessment to determine competency",
      "Prosecute (up to $300,000 fine and/or up to 5 years imprisonment)"
    ],
    inputFields: 2
  },
  {
    id: 7,
    question: "List three (3) people you should talk to about workplace hazards before starting work",
    answer: "Supervisors; Safety officers; Other personnel/workers",
    acceptableAnswers: [
      "Supervisors",
      "Safety officers",
      "Other personnel/workers",
      "Workplace engineers (if applicable)",
      "Site or operations managers",
      "Health and Safety Representatives",
      "WHS Committee members"
    ],
    inputFields: 3
  },
  {
    id: 8,
    question: "Why is it important to consult with others about workplace hazards?",
    answer: "To inform you of any site-specific hazards and controls",
    acceptableAnswers: [
      "To inform you of any site-specific hazards and controls",
      "To ensure adherence to workplace policies and site-specific procedures",
      "To clarify ground conditions and work area requirements"
    ],
    inputFields: 1
  },
  {
    id: 9,
    question: "What is the definition of:\na Hazard\na Risk",
    answer: "A hazard is a thing or situation that has the potential to cause harm to a person or cause damage; A risk is the possibility that harm (death, injury or illness) might happen when exposed to a hazard",
    acceptableAnswers: [
      "A hazard is a thing or situation that has the potential to cause harm to a person or cause damage",
      "A risk is the possibility that harm (death, injury or illness) might happen when exposed to a hazard"
    ],
    inputFields: 2
  },
  {
    id: 10,
    question: "Complete the order of the Hierarchy of Controls below:",
    answer: "Elimination; Substitution; Isolation; Engineering Controls; Administrative Controls; PPE",
    acceptableAnswers: [
      "Elimination",
      "Substitution",
      "Isolation",
      "Engineering Controls",
      "Administrative Controls",
      "PPE"
    ],
    inputFields: 6,
    displayFormat: 'hierarchy'
  },
  {
    id: 11,
    question: "List ten (10) hazards that relate to Order Picking Forklift operations that could be identified prior to operating",
    answer: "Overhead power lines; Ground surface conditions; Weather conditions; Rear end swing; Pedestrians; Batteries; Load stability; Unfamiliar equipment; Poor lighting; Communication failures",
    acceptableAnswers: [
      "Overhead power lines",
      "Ground surface conditions",
      "Weather conditions",
      "Rear end swing",
      "Pedestrians",
      "Batteries",
      "Load stability",
      "Unfamiliar equipment",
      "Poor lighting",
      "Communication failures"
    ],
    inputFields: 10
  },
  {
    id: 12,
    question: "What should the operator do if the Order Picking Forklift makes contact with an electrical source? (E.g. power supply to lights) List two (2) actions",
    answer: "Stay on the Order Picker; Warn others to stay away",
    acceptableAnswers: [
      "Stay on the Order Picker",
      "Warn others to stay away",
      "Avoid touching anything on the Order Picker",
      "Ensure power has been disconnected before leaving"
    ],
    inputFields: 2
  },
  {
    id: 13,
    question: "If the ground is wet and slippery, what are two (2) things we need to do?",
    answer: "Reduce speed; Avoid sudden braking",
    acceptableAnswers: [
      "Reduce speed",
      "Avoid sudden braking",
      "Proceed with caution"
    ],
    inputFields: 2
  },
  {
    id: 14,
    question: "Why is the rear of the Order Picking Forklift dangerous when it turns?",
    answer: "Because the rear swings wider than the front when turning",
    acceptableAnswers: [
      "Because the rear swings wider than the front when turning",
      "The rear turns up to three and a half times faster than the speed of forward travel"
    ],
    inputFields: 1
  },
  {
    id: 15,
    question: "What are three (3) safe ways to operate an Order Picker on wet slippery surfaces?",
    answer: "Reduce speed; Avoid sudden movements; Increase following distance",
    acceptableAnswers: [
      "Reduce speed",
      "Avoid sudden movements",
      "Increase following distance",
      "Use extra caution when turning"
    ],
    inputFields: 3
  },
  {
    id: 16,
    question: "List three (3) types of weather hazards that could affect Order Picker operations outdoors",
    answer: "High winds; Heavy rain; Extreme heat",
    acceptableAnswers: [
      "High winds",
      "Heavy rain",
      "Extreme heat",
      "Fog/low visibility",
      "Ice/snow"
    ],
    inputFields: 3
  },
  {
    id: 17,
    question: "What are three (3) hazards associated with operating attachments?",
    answer: "Reduced visibility; Changed load center; Increased machine weight",
    acceptableAnswers: [
      "Reduced visibility",
      "Changed load center",
      "Increased machine weight",
      "Different operating characteristics"
    ],
    inputFields: 3
  },
  {
    id: 18,
    question: "What are three (3) safe operating procedures when traveling with a load?",
    answer: "Keep load low; Tilt mast back; Observe speed limits",
    acceptableAnswers: [
      "Keep load low",
      "Tilt mast back",
      "Observe speed limits",
      "Watch for overhead obstructions"
    ],
    inputFields: 3
  },
  {
    id: 19,
    question: "What are three (3) factors that affect Order Picker stability?",
    answer: "Load weight; Load position; Ground conditions",
    acceptableAnswers: [
      "Load weight",
      "Load position",
      "Ground conditions",
      "Travel speed",
      "Mast height"
    ],
    inputFields: 3
  },
  {
    id: 20,
    question: "What is the stability triangle and why is it important?",
    answer: "The area formed by the front wheels and pivot point that determines the machine's stability limits",
    acceptableAnswers: [
      "The area formed by the front wheels and pivot point that determines the machine's stability limits"
    ],
    inputFields: 1
  },
  {
    id: 21,
    question: "What are three (3) causes of Order Picker tip-overs?",
    answer: "Overloading; Turning too sharply; Operating on uneven surfaces",
    acceptableAnswers: [
      "Overloading",
      "Turning too sharply",
      "Operating on uneven surfaces",
      "Lifting loads too high"
    ],
    inputFields: 3
  },
  {
    id: 22,
    question: "What should you do if the Order Picker starts to tip over?",
    answer: "Stay in the operator compartment, hold on firmly, and lean away from the direction of tip",
    acceptableAnswers: [
      "Stay in the operator compartment, hold on firmly, and lean away from the direction of tip"
    ],
    inputFields: 1
  },
  {
    id: 23,
    question: "What are three (3) safe operating procedures when working on ramps or inclines?",
    answer: "Drive straight up/down; Keep load uphill; Avoid turning on slopes",
    acceptableAnswers: [
      "Drive straight up/down",
      "Keep load uphill",
      "Avoid turning on slopes",
      "Reduce speed"
    ],
    inputFields: 3
  },
  {
    id: 24,
    question: "What are three (3) procedures for safely picking up a load?",
    answer: "Center load on forks; Check load stability; Verify weight capacity",
    acceptableAnswers: [
      "Center load on forks",
      "Check load stability",
      "Verify weight capacity",
      "Ensure clear travel path"
    ],
    inputFields: 3
  },
  {
    id: 25,
    question: "What are three (3) procedures for safely placing a load?",
    answer: "Approach slowly; Level forks before placing; Verify placement is secure",
    acceptableAnswers: [
      "Approach slowly",
      "Level forks before placing",
      "Verify placement is secure",
      "Check for stability"
    ],
    inputFields: 3
  },
  {
    id: 26,
    question: "What are three (3) hazards when stacking loads?",
    answer: "Unstable stacks; Overhead obstructions; Limited visibility",
    acceptableAnswers: [
      "Unstable stacks",
      "Overhead obstructions",
      "Limited visibility",
      "Falling objects"
    ],
    inputFields: 3
  },
  {
    id: 27,
    question: "What are three (3) safe procedures when working around pedestrians?",
    answer: "Maintain safe distance; Use horn at blind spots; Stop if pedestrians are near",
    acceptableAnswers: [
      "Maintain safe distance",
      "Use horn at blind spots",
      "Stop if pedestrians are near",
      "Establish eye contact"
    ],
    inputFields: 3
  },
  {
    id: 28,
    question: "What are three (3) types of signs or markings you might see in a workplace?",
    answer: "Speed limit signs; Pedestrian crossing markings; Loading zone signs",
    acceptableAnswers: [
      "Speed limit signs",
      "Pedestrian crossing markings",
      "Loading zone signs",
      "Overhead clearance signs"
    ],
    inputFields: 3
  },
  {
    id: 29,
    question: "What are three (3) procedures for safely parking an Order Picker?",
    answer: "Lower forks to floor; Apply parking brake; Turn off power",
    acceptableAnswers: [
      "Lower forks to floor",
      "Apply parking brake",
      "Turn off power",
      "Remove key (if applicable)"
    ],
    inputFields: 3
  },
  {
    id: 30,
    question: "What are three (3) shutdown procedures for an Order Picker?",
    answer: "Park in designated area; Complete inspection; Report any issues",
    acceptableAnswers: [
      "Park in designated area",
      "Complete inspection",
      "Report any issues",
      "Secure the machine"
    ],
    inputFields: 3
  },
  {
    id: 31,
    question: "What are three (3) post-operational checks that must be conducted?",
    answer: "Check for damage; Record operating hours; Inspect safety devices",
    acceptableAnswers: [
      "Check for damage",
      "Record operating hours",
      "Inspect safety devices",
      "Verify fluid levels"
    ],
    inputFields: 3
  },
  {
    id: 32,
    question: "What are three (3) types of documentation that must be completed?",
    answer: "Pre-operation checklist; Maintenance log; Incident reports",
    acceptableAnswers: [
      "Pre-operation checklist",
      "Maintenance log",
      "Incident reports",
      "Load inspection records"
    ],
    inputFields: 3
  },
  {
    id: 33,
    question: "What are three (3) emergency procedures you should be aware of?",
    answer: "Emergency shutdown; Evacuation routes; First aid locations",
    acceptableAnswers: [
      "Emergency shutdown",
      "Evacuation routes",
      "First aid locations",
      "Fire extinguisher locations"
    ],
    inputFields: 3
  },
  {
    id: 34,
    question: "What should you do in case of an accident or incident?",
    answer: "Secure the area, report to supervisor, complete incident report",
    acceptableAnswers: [
      "Secure the area, report to supervisor, complete incident report"
    ],
    inputFields: 1
  },
  {
    id: 35,
    question: "What are three (3) types of loads that require special handling?",
    answer: "Dangerous goods; Oversized loads; Fragile items",
    acceptableAnswers: [
      "Dangerous goods",
      "Oversized loads",
      "Fragile items",
      "Temperature-sensitive loads"
    ],
    inputFields: 3
  },
  {
    id: 36,
    question: "What are three (3) procedures for handling dangerous goods?",
    answer: "Check SDS; Use proper PPE; Follow segregation rules",
    acceptableAnswers: [
      "Check SDS",
      "Use proper PPE",
      "Follow segregation rules",
      "Verify compatibility"
    ],
    inputFields: 3
  },
  {
    id: 37,
    question: "What are three (3) types of communication methods used in the workplace?",
    answer: "Hand signals; Two-way radios; Warning alarms",
    acceptableAnswers: [
      "Hand signals",
      "Two-way radios",
      "Warning alarms",
      "Visual displays"
    ],
    inputFields: 3
  },
  {
    id: 38,
    question: "What are three (3) procedures for working in confined spaces?",
    answer: "Check ventilation; Maintain clear exit; Use spotter when needed",
    acceptableAnswers: [
      "Check ventilation",
      "Maintain clear exit",
      "Use spotter when needed",
      "Monitor air quality"
    ],
    inputFields: 3
  },
  {
    id: 39,
    question: "What are three (3) procedures for working at night or in poor visibility?",
    answer: "Use all lights; Reduce speed; Increase scanning",
    acceptableAnswers: [
      "Use all lights",
      "Reduce speed",
      "Increase scanning",
      "Use spotter when needed"
    ],
    inputFields: 3
  },
  {
    id: 40,
    question: "What are three (3) procedures for working in wet conditions?",
    answer: "Check tire traction; Increase stopping distance; Avoid sudden moves",
    acceptableAnswers: [
      "Check tire traction",
      "Increase stopping distance",
      "Avoid sudden moves",
      "Watch for hydroplaning"
    ],
    inputFields: 3
  },
  {
    id: 41,
    question: "What are three (3) procedures for working in cold storage areas?",
    answer: "Wear proper clothing; Check for ice buildup; Monitor exposure time",
    acceptableAnswers: [
      "Wear proper clothing",
      "Check for ice buildup",
      "Monitor exposure time",
      "Watch for condensation"
    ],
    inputFields: 3
  },
  {
    id: 42,
    question: "What are three (3) procedures for working with pallets?",
    answer: "Inspect pallet condition; Center load properly; Verify weight limits",
    acceptableAnswers: [
      "Inspect pallet condition",
      "Center load properly",
      "Verify weight limits",
      "Check for damage"
    ],
    inputFields: 3
  },
  {
    id: 43,
    question: "What are three (3) types of pallet damage that make them unsafe to use?",
    answer: "Broken boards; Missing blocks; Protruding nails",
    acceptableAnswers: [
      "Broken boards",
      "Missing blocks",
      "Protruding nails",
      "Split stringers"
    ],
    inputFields: 3
  },
  {
    id: 44,
    question: "What are three (3) procedures for working with shipping containers?",
    answer: "Check container stability; Verify floor condition; Ensure proper ventilation",
    acceptableAnswers: [
      "Check container stability",
      "Verify floor condition",
      "Ensure proper ventilation",
      "Watch for overhead obstructions"
    ],
    inputFields: 3
  },
  {
    id: 45,
    question: "What are three (3) procedures for working on loading docks?",
    answer: "Check dock lock status; Verify trailer is secured; Watch edge of dock",
    acceptableAnswers: [
      "Check dock lock status",
      "Verify trailer is secured",
      "Watch edge of dock",
      "Use spotter when backing"
    ],
    inputFields: 3
  },
  {
    id: 46,
    question: "What are three (3) procedures for entering/exiting trailers?",
    answer: "Check trailer brakes; Verify dock plate is secure; Inspect trailer floor",
    acceptableAnswers: [
      "Check trailer brakes",
      "Verify dock plate is secure",
      "Inspect trailer floor",
      "Use proper lighting"
    ],
    inputFields: 3
  },
  {
    id: 47,
    question: "What are three (3) procedures for working near overhead power lines?",
    answer: "Maintain safe distance; Use spotter when close; Assume lines are live",
    acceptableAnswers: [
      "Maintain safe distance",
      "Use spotter when close",
      "Assume lines are live",
      "Follow company procedures"
    ],
    inputFields: 3
  },
  {
    id: 48,
    question: "What are three (3) procedures for refueling an Order Picker?",
    answer: "Turn off engine; No smoking; Clean up spills",
    acceptableAnswers: [
      "Turn off engine",
      "No smoking",
      "Clean up spills",
      "Use proper containers"
    ],
    inputFields: 3
  },
  {
    id: 49,
    question: "What are three (3) procedures for charging batteries?",
    answer: "Ensure ventilation; Check fluid levels; Follow charging schedule",
    acceptableAnswers: [
      "Ensure ventilation",
      "Check fluid levels",
      "Follow charging schedule",
      "Use proper PPE"
    ],
    inputFields: 3
  },
  {
    id: 50,
    question: "What are three (3) types of Order Picker fires and appropriate extinguishers?",
    answer: "Electrical (CO2); Fuel (Dry Chemical); Battery (Class D)",
    acceptableAnswers: [
      "Electrical (CO2)",
      "Fuel (Dry Chemical)",
      "Battery (Class D)",
      "Hydraulic fluid (Foam)"
    ],
    inputFields: 3
  },
  {
    id: 51,
    question: "What are three (3) procedures for working in high traffic areas?",
    answer: "Follow designated paths; Use horn at intersections; Maintain safe speed",
    acceptableAnswers: [
      "Follow designated paths",
      "Use horn at intersections",
      "Maintain safe speed",
      "Watch for pedestrians"
    ],
    inputFields: 3
  },
  {
    id: 52,
    question: "What are three (3) procedures for working with fragile loads?",
    answer: "Handle gently; Use proper attachments; Secure properly",
    acceptableAnswers: [
      "Handle gently",
      "Use proper attachments",
      "Secure properly",
      "Check frequently"
    ],
    inputFields: 3
  },
  {
    id: 53,
    question: "What are three (3) procedures for working with tall loads?",
    answer: "Check overhead clearance; Travel in reverse if needed; Use spotter",
    acceptableAnswers: [
      "Check overhead clearance",
      "Travel in reverse if needed",
      "Use spotter",
      "Secure load properly"
    ],
    inputFields: 3
  },
  {
    id: 54,
    question: "What are three (3) procedures for working with wide loads?",
    answer: "Check clearances; Use warning devices; Travel slowly",
    acceptableAnswers: [
      "Check clearances",
      "Use warning devices",
      "Travel slowly",
      "Use spotter"
    ],
    inputFields: 3
  },
  {
    id: 55,
    question: "What are three (3) procedures for working with cylindrical loads?",
    answer: "Use proper attachments; Secure from rolling; Handle carefully",
    acceptableAnswers: [
      "Use proper attachments",
      "Secure from rolling",
      "Handle carefully",
      "Check balance"
    ],
    inputFields: 3
  },
  {
    id: 56,
    question: "What are three (3) procedures for working with loose loads?",
    answer: "Use containment; Avoid sudden moves; Check frequently",
    acceptableAnswers: [
      "Use containment",
      "Avoid sudden moves",
      "Check frequently",
      "Secure properly"
    ],
    inputFields: 3
  },
  {
    id: 57,
    question: "What are three (3) procedures for working with hot loads?",
    answer: "Use proper PPE; Maintain safe distance; Check handling equipment",
    acceptableAnswers: [
      "Use proper PPE",
      "Maintain safe distance",
      "Check handling equipment",
      "Follow SDS guidelines"
    ],
    inputFields: 3
  },
  {
    id: 58,
    question: "What are three (3) procedures for working with cold loads?",
    answer: "Wear insulated gloves; Check for condensation; Monitor exposure time",
    acceptableAnswers: [
      "Wear insulated gloves",
      "Check for condensation",
      "Monitor exposure time",
      "Follow handling procedures"
    ],
    inputFields: 3
  },
  {
    id: 59,
    question: "What are three (3) procedures for working with sharp loads?",
    answer: "Use protective covers; Handle carefully; Inspect for damage",
    acceptableAnswers: [
      "Use protective covers",
      "Handle carefully",
      "Inspect for damage",
      "Wear cut-resistant gloves"
    ],
    inputFields: 3
  },
  {
    id: 60,
    question: "What are three (3) procedures for working with toxic loads?",
    answer: "Check SDS; Use proper PPE; Follow containment procedures",
    acceptableAnswers: [
      "Check SDS",
      "Use proper PPE",
      "Follow containment procedures",
      "Monitor for leaks"
    ],
    inputFields: 3
  },
  {
    id: 61,
    question: "What are three (3) procedures for working with flammable loads?",
    answer: "Eliminate ignition sources; Use proper equipment; Follow storage rules",
    acceptableAnswers: [
      "Eliminate ignition sources",
      "Use proper equipment",
      "Follow storage rules",
      "Have fire extinguisher ready"
    ],
    inputFields: 3
  },
  {
    id: 62,
    question: "What are three (3) procedures for working with flammable loads?",
    answer: "Eliminate ignition sources; Use proper equipment; Follow storage rules",
    acceptableAnswers: [
      "Eliminate ignition sources",
      "Use proper equipment",
      "Follow storage rules",
      "Have fire extinguisher ready"
    ],
    inputFields: 3
  },
  {
    id: 63,
    question: "What are three (3) procedures for working with explosive loads?",
    answer: "Follow strict handling procedures; Use appropriate equipment; Maintain safe distances",
    acceptableAnswers: [
      "Follow strict handling procedures",
      "Use appropriate equipment",
      "Maintain safe distances",
      "Ensure proper storage conditions"
    ],
    inputFields: 3
  },
  {
    id: 64,
    question: "What are three (3) procedures for working with radioactive loads?",
    answer: "Use proper shielding; Limit exposure; Follow radiation protocols",
    acceptableAnswers: [
      "Use proper shielding",
      "Limit exposure",
      "Follow radiation protocols",
      "Use dosimeters"
    ],
    inputFields: 3
  },
  {
    id: 65,
    question: "Why must batteries be charged in a well ventilated area?",
    answer: "To prevent build-up of explosive hydrogen gas produced during charging",
    acceptableAnswers: [
      "To prevent build-up of explosive hydrogen gas produced during charging",
      "To avoid risk of explosion from hydrogen gas",
      "To ensure safety from flammable gases"
    ],
    inputFields: 1
  },
  {
    id: 66,
    question: "What are three (3) procedures for working with compressed gas cylinders?",
    answer: "Secure cylinders upright; Protect valves; Store properly",
    acceptableAnswers: [
      "Secure cylinders upright",
      "Protect valves",
      "Store properly",
      "Use correct regulators"
    ],
    inputFields: 3
  },
  {
    id: 67,
    question: "What are three (3) procedures for working with bulk liquids?",
    answer: "Check container integrity; Use correct handling equipment; Prevent spills",
    acceptableAnswers: [
      "Check container integrity",
      "Use correct handling equipment",
      "Prevent spills",
      "Ensure proper labeling"
    ],
    inputFields: 3
  },
  {
    id: 68,
    question: "What are three (3) procedures for working with food products?",
    answer: "Maintain hygiene; Control temperature; Avoid contamination",
    acceptableAnswers: [
      "Maintain hygiene",
      "Control temperature",
      "Avoid contamination",
      "Follow food safety standards"
    ],
    inputFields: 3
  },
  {
    id: 69,
    question: "What are three (3) procedures for working with pharmaceutical products?",
    answer: "Follow handling procedures; Control environment; Record handling details",
    acceptableAnswers: [
      "Follow handling procedures",
      "Control environment",
      "Record handling details",
      "Avoid contamination"
    ],
    inputFields: 3
  },
  {
    id: 70,
    question: "What are three (3) procedures for working with electronic equipment?",
    answer: "Avoid static discharge; Use proper packaging; Handle with care",
    acceptableAnswers: [
      "Avoid static discharge",
      "Use proper packaging",
      "Handle with care",
      "Use anti-static wrist straps"
    ],
    inputFields: 3
  },
  {
    id: 71,
    question: "What are three (3) procedures for working with construction materials?",
    answer: "Check load stability; Use suitable equipment; Consider load distribution",
    acceptableAnswers: [
      "Check load stability",
      "Use suitable equipment",
      "Consider load distribution",
      "Avoid overhead lifting"
    ],
    inputFields: 3
  }  