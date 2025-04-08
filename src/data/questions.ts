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
    answer: "Work Health and Safety Act 2012 (SA), Work Health and Safety Regulations 2012 (SA), Codes of Practice, Australian Standards, WHS policy and procedures, Safe working procedures, Management plans, Manufacturer’s specifications",
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
    answer: "Provide and maintain a work environment without risks to health and safety, Provide and maintain safe plant and structures, Provide and maintain safe systems of work, Provide and maintain adequate facilities, Provide and maintain any information, training, instruction or supervision for the work to be undertaken safely, Provide and maintain procedures and systems to ensure the safe use, handling and storage of plant, structures and substances, Provide and maintain monitoring of health for workers and the conditions at the workplace to prevent illness or injury",
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
    answer: "Information, Training, Instruction, Supervision",
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
    answer: "Take reasonable care for your own health and safety, Take reasonable care for the health and safety of others",
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
    answer: "Safety Officers; Managers; Engineers",
    acceptableAnswers: [
      "Safety Officers",
      "Managers",
      "Engineers",
      "Work team",
      "Supervisors"
    ],
    inputFields: 3
  },
  {
    id: 7,
    question: "Why is it important to consult with others about workplace hazards?",
    answer: "Consultation helps to identify and manage workplace hazards effectively; It ensures adherence to workplace policies and site-specific safety procedures; It provides information about task plans, required equipment, and specifics of the task",
    acceptableAnswers: [
      "Consultation helps to identify and manage workplace hazards effectively",
      "It ensures adherence to workplace policies and site-specific safety procedures",
      "It provides information about task plans, required equipment, and specifics of the task"
    ],
    inputFields: 1
  },
  {
    id: 8,
    question: "When planning for safe Forklift operations, identify six (6) things you need to consider.",
    answer: "Characteristics of load; Communication; Access and egress; Location of task; Specifics of task; Permits required",
    acceptableAnswers: [
      "Characteristics of load including unusual shapes and weights",
      "Communication (safe and adequate)",
      "Access and egress",
      "Location of task",
      "Specifics of task",
      "Permits required for the task",
      "Equipment required for the task",
      "Availability of equipment",
      "Capacity of the forklift",
      "Route of travel",
      "Attachments are compliant & on the data plate",
      "Task plans",
      "Plant required for the task",
      "Specialised equipment required for the task",
      "Weights, load bearing capabilities",
      "Other information that may assist the operator to plan the job"
    ],
    inputFields: 6
  },
  {
    id: 9,
    question: "What is the definition of:\na Risk\na Hazard",
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
      "2. Substitution",
      "3. Isolation",
      "5. Administrative Controls",
      "6. PPE"
    ],
    inputFields: 4,
    prefilledAnswers: {
      1: "Elimination",
      4: "Engineering Controls"
    },
    displayFormat: 'hierarchy'
  },
  {
    id: 11,
    question: "List ten (10) hazards that relate to forklift operations that could be identified prior to operating.",
    answer: "Pedestrians in the forklift zone; Obstructions (e.g., pallets, debris); Uneven or unstable ground; Adverse weather (wind, rain); Blind spots/doorways; Overhead power lines; Slippery/wet surfaces; Poor lighting; Incorrect load placement (e.g., overloading); Improper use of attachments",
    acceptableAnswers: [
      "Pedestrians in the forklift zone",
      "Obstructions (e.g., pallets, debris)",
      "Uneven or unstable ground",
      "Adverse weather (wind, rain)",
      "Blind spots/doorways",
      "Overhead power lines",
      "Slippery/wet surfaces",
      "Poor lighting",
      "Incorrect load placement (e.g., overloading)",
      "Improper use of attachments"
    ],
    inputFields: 10
  },
  {
    id: 12,
    question: "How can you find out information about the voltage of the power lines?",
    answer: "Maximum load capacity; Load center; Mast tilt angles",
    acceptableAnswers: [
      "Contact the power authority/supplier directly (like SA Power Networks);",
      "Check for voltage indicators (e.g., signage, markers, or compliance plates on poles/towers);",
      "Consult with site management or supervisors;",
      "Refer to site plans or electrical diagrams;",
      "Checking warning signs on the poles or towers;",
      "Consulting site documentation or area plans."
    ],
    inputFields: 1
  },
  {
    id: 13,
    question: "What are the minimum safe distances you must maintain near overhead electric power lines?",
    answer: "Maximum load capacity at different lift heights and load centers",
    inputFields: 1
  },
  {
    id: 14,
    question: "List two (2) visual indicators that can identify overhead electric powerlines.",
    answer: "Load center; Lift height; Mast tilt angle",
    inputFields: 3
  },
  {
    id: 15,
    question: "What procedure should be followed if contact is made with power conductors?",
    answer: "The horizontal distance from the face of the forks to the load's center of gravity; it affects the forklift's stability and load capacity",
    inputFields: 1
  },
  {
    id: 16,
    question: "What are three (3) safe ways to operate a forklift on wet slippery surfaces?",
    answer: "Side shift; Fork extensions; Drum clamps",
    inputFields: 3
  },
  {
    id: 17,
    question: "List three (3) types of weather hazards that could affect forklift operations outdoors.",
    answer: "They reduce the load capacity due to their weight and may change the load center",
    inputFields: 1
  },
  {
    id: 18,
    question: "What are three (3) hazards associated with operating attachments?",
    answer: "Reduced visibility; Changed load center; Altered stability",
    inputFields: 3
  },
  {
    id: 19,
    question: "What are three (3) safe operating procedures when traveling with a load?",
    answer: "Keep forks approximately 15-20cm off ground; Tilt mast back; Travel at safe speed",
    inputFields: 3
  },
  {
    id: 20,
    question: "What are three (3) factors that affect forklift stability?",
    answer: "Load weight; Speed and turning; Surface conditions",
    inputFields: 3
  },
  {
    id: 21,
    question: "What is the stability triangle and why is it important?",
    answer: "The triangular area between the drive wheels and the pivot point; it helps understand the forklift's center of gravity and stability limits",
    inputFields: 1
  },
  {
    id: 22,
    question: "What are three (3) causes of forklift tip-overs?",
    answer: "Overloading; Turning too quickly; Operating on slopes",
    inputFields: 3
  },
  {
    id: 23,
    question: "What should you do if the forklift starts to tip over?",
    answer: "Stay in the cabin, hold on firmly, brace yourself, and lean away from the direction of the fall",
    inputFields: 1
  },
  {
    id: 24,
    question: "What are three (3) safe operating procedures when working on ramps or inclines?",
    answer: "Drive forward up ramps; Drive in reverse down ramps; Keep load uphill",
    inputFields: 3
  },
  {
    id: 25,
    question: "What are three (3) procedures for safely picking up a load?",
    answer: "Check load weight; Center forks under load; Ensure load is stable",
    inputFields: 3
  },
  {
    id: 26,
    question: "What are three (3) procedures for safely placing a load?",
    answer: "Check stack stability; Ensure adequate space; Lower load gently",
    inputFields: 3
  },
  {
    id: 27,
    question: "What are three (3) hazards when stacking loads?",
    answer: "Stack collapse; Overhead obstacles; Limited visibility",
    inputFields: 3
  },
  {
    id: 28,
    question: "What are three (3) safe procedures when working around pedestrians?",
    answer: "Use horn at intersections; Maintain safe distance; Stop if pedestrians are too close",
    inputFields: 3
  },
  {
    id: 29,
    question: "What are three (3) types of signs or markings you might see in a workplace?",
    answer: "Speed limits; Pedestrian crossings; Loading zones",
    inputFields: 3
  },
  {
    id: 30,
    question: "What are three (3) procedures for safely parking a forklift?",
    answer: "Lower forks to ground; Apply park brake; Remove key",
    inputFields: 3
  },
  {
    id: 31,
    question: "What are three (3) shutdown procedures for a forklift?",
    answer: "Park in designated area; Turn off engine; Complete post-operational checks",
    inputFields: 3
  },
  {
    id: 32,
    question: "What are three (3) post-operational checks that must be conducted?",
    answer: "Check for damage; Record hours of operation; Report any issues",
    inputFields: 3
  },
  {
    id: 33,
    question: "What are three (3) types of documentation that must be completed?",
    answer: "Pre-operational checklist; Maintenance records; Incident reports",
    inputFields: 3
  },
  {
    id: 34,
    question: "What are three (3) emergency procedures you should be aware of?",
    answer: "Emergency shutdown; Evacuation procedures; First aid locations",
    inputFields: 3
  },
  {
    id: 35,
    question: "What should you do in case of an accident or incident?",
    answer: "Stop work, secure the area, report to supervisor, and complete incident report",
    inputFields: 1
  },
  {
    id: 36,
    question: "What are three (3) types of loads that require special handling?",
    answer: "Dangerous goods; Long loads; Unstable loads",
    inputFields: 3
  },
  {
    id: 37,
    question: "What are three (3) procedures for handling dangerous goods?",
    answer: "Check SDS; Use appropriate PPE; Follow specific handling procedures",
    inputFields: 3
  },
  {
    id: 38,
    question: "What are three (3) types of communication methods used in the workplace?",
    answer: "Hand signals; Radio communication; Verbal instructions",
    inputFields: 3
  },
  {
    id: 39,
    question: "What are three (3) procedures for working in confined spaces?",
    answer: "Check ventilation; Maintain clear exit path; Use spotter when required",
    inputFields: 3
  },
  {
    id: 40,
    question: "What are three (3) procedures for working at night or in poor visibility?",
    answer: "Use lights; Reduce speed; Increase awareness of surroundings",
    inputFields: 3
  },
  {
    id: 41,
    question: "What are three (3) procedures for working in wet conditions?",
    answer: "Check tyre grip; Reduce speed; Increase braking distance",
    inputFields: 3
  },
  {
    id: 42,
    question: "What are three (3) procedures for working in cold storage areas?",
    answer: "Wear appropriate clothing; Check for ice buildup; Monitor exposure time",
    inputFields: 3
  },
  {
    id: 43,
    question: "What are three (3) procedures for working with pallets?",
    answer: "Check pallet condition; Ensure correct fork spacing; Center load on pallet",
    inputFields: 3
  },
  {
    id: 44,
    question: "What are three (3) types of pallet damage that make them unsafe to use?",
    answer: "Broken boards; Split stringers; Protruding nails",
    inputFields: 3
  },
  {
    id: 45,
    question: "What are three (3) procedures for working with shipping containers?",
    answer: "Check container stability; Use appropriate lighting; Ensure adequate ventilation",
    inputFields: 3
  },
  {
    id: 46,
    question: "What are three (3) procedures for working on loading docks?",
    answer: "Check dock plate security; Ensure trailer is secured; Watch for edge of dock",
    inputFields: 3
  },
  {
    id: 47,
    question: "What are three (3) procedures for entering/exiting trailers?",
    answer: "Check trailer is secured; Use dock plate correctly; Check trailer floor condition",
    inputFields: 3
  },
  {
    id: 48,
    question: "What are three (3) procedures for working near overhead power lines?",
    answer: "Maintain safe clearance; Watch for warning signs; Use spotter if necessary",
    inputFields: 3
  },
  {
    id: 49,
    question: "What are three (3) procedures for refueling a forklift?",
    answer: "Turn off engine; No smoking; Clean up spills immediately",
    inputFields: 3
  },
  {
    id: 50,
    question: "What are three (3) procedures for charging batteries?",
    answer: "Ensure ventilation; Wear PPE; Follow charging procedures",
    inputFields: 3
  },
  {
    id: 51,
    question: "What are three (3) types of forklift fires and appropriate extinguishers?",
    answer: "Electrical (CO2); Fuel (Dry Chemical); Engine (Foam)",
    inputFields: 3
  },
  {
    id: 52,
    question: "What are three (3) procedures for working in high traffic areas?",
    answer: "Use designated routes; Make eye contact; Use horn at intersections",
    inputFields: 3
  },
  {
    id: 53,
    question: "What are three (3) procedures for working with fragile loads?",
    answer: "Handle gently; Use appropriate attachments; Stack carefully",
    inputFields: 3
  },
  {
    id: 54,
    question: "What are three (3) procedures for working with tall loads?",
    answer: "Check overhead clearance; Travel in reverse if visibility blocked; Use spotter if needed",
    inputFields: 3
  },
  {
    id: 55,
    question: "What are three (3) procedures for working with wide loads?",
    answer: "Check clearances; Use warning signs; Travel at reduced speed",
    inputFields: 3
  },
  {
    id: 56,
    question: "What are three (3) procedures for working with cylindrical loads?",
    answer: "Use appropriate attachments; Secure load; Handle carefully",
    inputFields: 3
  },
  {
    id: 57,
    question: "What are three (3) procedures for working with loose loads?",
    answer: "Use appropriate containment; Stack carefully; Avoid sudden movements",
    inputFields: 3
  },
  {
    id: 58,
    question: "What are three (3) procedures for working with hot loads?",
    answer: "Use appropriate attachments; Maintain safe distance; Wear appropriate PPE",
    inputFields: 3
  },
  {
    id: 59,
    question: "What are three (3) procedures for working with cold loads?",
    answer: "Check for condensation; Use appropriate handling equipment; Wear appropriate PPE",
    inputFields: 3
  },
  {
    id: 60,
    question: "What are three (3) procedures for working with sharp loads?",
    answer: "Use appropriate protection; Handle carefully; Wear appropriate PPE",
    inputFields: 3
  },
  {
    id: 61,
    question: "What are three (3) procedures for working with toxic loads?",
    answer: "Check SDS; Use appropriate containment; Wear appropriate PPE",
    inputFields: 3
  },
  {
    id: 62,
    question: "What are three (3) procedures for working with flammable loads?",
    answer: "Remove ignition sources; Use appropriate handling equipment; Follow safety procedures",
    inputFields: 3
  },
  {
    id: 63,
    question: "What are three (3) procedures for working with explosive loads?",
    answer: "Follow strict handling procedures; Use appropriate equipment; Maintain safe distances",
    inputFields: 3
  },
  {
    id: 64,
    question: "What are three (3) procedures for working with radioactive loads?",
    answer: "Follow radiation safety procedures; Use appropriate shielding; Monitor exposure",
    inputFields: 3
  },
  {
    id: 65,
    question: "Why must batteries be charged in a well ventilated area?",
    answer: "To prevent build-up of explosive hydrogen gas produced during charging",
    inputFields: 1
  },
  {
    id: 66,
    question: "What are three (3) procedures for working with compressed gas cylinders?",
    answer: "Secure cylinders; Use appropriate handling equipment; Keep valves protected",
    inputFields: 3
  },
  {
    id: 67,
    question: "What are three (3) procedures for working with bulk liquids?",
    answer: "Check container integrity; Use appropriate attachments; Handle carefully to prevent spills",
    inputFields: 3
  },
  {
    id: 68,
    question: "What are three (3) procedures for working with food products?",
    answer: "Maintain hygiene standards; Check temperature requirements; Handle carefully to prevent damage",
    inputFields: 3
  },
  {
    id: 69,
    question: "What are three (3) procedures for working with pharmaceutical products?",
    answer: "Follow strict handling procedures; Maintain required conditions; Document movements",
    inputFields: 3
  },
  {
    id: 70,
    question: "What are three (3) procedures for working with electronic equipment?",
    answer: "Handle carefully; Protect from static; Use appropriate packaging",
    inputFields: 3
  },
  {
    id: 71,
    question: "What are three (3) procedures for working with construction materials?",
    answer: "Check load stability; Use appropriate attachments; Consider weight distribution",
    inputFields: 3
  }
];