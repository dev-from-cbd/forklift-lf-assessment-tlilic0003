// Define the Question interface - Structure for all question objects in the assessment
export interface Question {
  id: number;                   // Unique identifier for each question
  question: string;             // The text of the question to be displayed to the user
  answer: string;               // The correct answer or reference answer text
  inputFields?: number;         // Optional: Number of input fields to display for the answer (how many answers user needs to provide)
  acceptableAnswers?: string[]; // Optional: Array of acceptable alternative answers that will be considered correct
  prefilledAnswers?: { [key: number]: string }; // Optional: Object mapping field index to prefilled text for partially completed answers
  displayFormat?: 'hierarchy';  // Optional: Special display format for the question (currently only 'hierarchy' supported)
}

// Export the questions array - Collection of all assessment questions for the forklift license test
export const questions: Question[] = [
  {
    id: 1,                      // First question identifier
    question: "What safety feature on the Order Picking Forklift must be closed at all times when operating?", // Question about essential safety feature
    answer: "Handrail",         // The correct answer is Handrail
    acceptableAnswers: [        // List of acceptable answers (only one in this case)
      "Handrail"
    ],
    inputFields: 1              // User needs to provide one answer
  },
  {
    id: 2,                      // Second question identifier
    question: "What are three (3) documented sources you could refer to for workplace safety information?", // Question about safety information sources
    answer: "Work Health and Safety Act 2012 (SA); Work Health and Safety Regulations 2012 (SA); Codes of Practice; Australian Standards; WHS policy and procedures; Safe working procedures; Management plans; Manufacturer's specifications", // Combined reference answer with all possible options
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Work Health and Safety Act 2012 (SA)",      // Legal document specific to South Australia
      "Work Health and Safety Regulations 2012 (SA)", // Regulations specific to South Australia
      "Codes of Practice",      // Industry standard practices
      "Australian Standards",   // National standards for safety
      "WHS policy and procedures", // Workplace-specific policies
      "Safe working procedures", // Documented safety procedures
      "Management plans",       // Organizational safety plans
      "Relevant Australian Standards", // Specific standards relevant to the task
      "Manufacturer specifications", // Equipment specifications from manufacturer
      "Order Picker Operator Manual", // Equipment-specific manual
      "Regulatory guidelines for Order Picker Operations", // Government guidelines
      "Manufacturer's specifications" // Detailed specifications from manufacturer
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 3,                      // Third question identifier
    question: "What are three (3) duties a PCBU should take to ensure the health and safety of a worker?", // Question about PCBU (Person Conducting a Business or Undertaking) duties
    answer: "Provide and maintain a work environment without risks to health and safety; Provide and maintain safe plant and structures, Provide and maintain safe systems of work; Provide and maintain adequate facilities; Provide and maintain any information, training, instruction or supervision for the work to be undertaken safely; Provide and maintain procedures and systems to ensure the safe use, handling and storage of plant, structures and substances; Provide and maintain monitoring of health for workers and the conditions at the workplace to prevent illness or injury", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Provide and maintain safe plant and structures", // Ensuring equipment safety
      "Provide and maintain safe systems of work", // Ensuring process safety
      "Provide and maintain adequate facilities", // Providing proper facilities
      "Provide and maintain a work environment without risks to health and safety", // Creating safe environment
      "Provide and maintain any information, training, instruction or supervision for the work to be undertaken safely", // Ensuring proper training
      "Provide and maintain procedures and systems to ensure the safe use, handling and storage of plant, structures and substances", // Establishing safety procedures
      "Provide and maintain monitoring of health for workers and the conditions at the workplace to prevent illness or injury" // Health monitoring
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 4,                      // Fourth question identifier
    question: "After successfully obtaining your High Risk Work Licence, list two (2) things your employer must provide prior to you before operating an unfamiliar Order Picking Forklift.", // Question about employer requirements
    answer: "Information; Training; Instruction; Supervision", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Information",            // Providing necessary information
      "Training",               // Providing proper training
      "Instruction",            // Providing specific instructions
      "Supervision"             // Providing adequate supervision
    ],
    inputFields: 2              // User needs to provide two answers
  },
  {
    id: 5,                      // Fifth question identifier
    question: "What does the Duty of Care as a worker involve? List two (2) responsibilities", // Question about worker responsibilities
    answer: "Take reasonable care for your own health and safety; Take reasonable care for the health and safety of others", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Take reasonable care for your own health and safety", // Self-care responsibility
      "Take reasonable care for the health and safety of others who may be affected by their own acts or omissions", // Care for others
      "Cooperate with anything the employer does to comply with WHS requirements", // Cooperation with employer
      "Not intentionally or recklessly interfere with or misuse anything provided at the workplace for WHS" // Proper use of safety equipment
    ],
    inputFields: 2              // User needs to provide two answers
  },
  {
    id: 6,                      // Sixth question identifier
    question: "What are two (2) actions the Work Health and Safety Regulator could do if it is found that you were not working safely as a High Risk Work Licence holder?", // Question about regulatory consequences
    answer: "Suspend their HRW licence; Cancel their HRW licence; Refuse to renew HRW licence", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Suspend their HRW licence", // Temporary license suspension
      "Cancel their HRW licence", // Permanent license cancellation
      "Refuse to renew HRW licence", // Denial of license renewal
      "Direct reassessment to determine competency", // Mandatory reassessment
      "Prosecute (up to $300,000 fine and/or up to 5 years imprisonment)" // Legal prosecution
    ],
    inputFields: 2              // User needs to provide two answers
  },
  {
    id: 7,                      // Seventh question identifier
    question: "List three (3) people you should talk to about workplace hazards before starting work", // Question about workplace communication
    answer: "Supervisors; Safety officers; Other personnel/workers", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Supervisors",            // Direct managers
      "Safety officers",        // Workplace safety specialists
      "Other personnel/workers", // Colleagues
      "Workplace engineers (if applicable)", // Technical specialists
      "Site or operations managers", // Site management
      "Health and Safety Representatives", // Elected safety representatives
      "WHS Committee members"   // Safety committee members
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 8,                      // Eighth question identifier
    question: "Why is it important to consult with others about workplace hazards?", // Question about importance of consultation
    answer: "To inform you of any site-specific hazards and ground conditions; To ensure that you adhere to any workplace policies and site-specific procedures", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "To inform you of any site-specific hazards and ground conditions", // Awareness of specific hazards
      "To ensure that you adhere to any workplace policies and site-specific procedures" // Compliance with procedures
    ],
    inputFields: 1              // User needs to provide one answer
  },
  {
    id: 9,                      // Ninth question identifier
    question: "List six (6) things that you need to plan for before operating the Order Picking Forklift", // Question about pre-operation planning
    answer: "Location of the work area; Specific details of the task; The travel path of the Order Picker; Size and type of the Order Picker; Capacity of the Order Picker; Equipment/attachments required for the task; Availability of the equipment; Method of attachment; Characteristics (size, weight, shape) of the load; Pick up and unloading destinations; Is traffic control/an exclusion zone required?; Adequate and safe communications; Type of load – e.g. flammable, fragile, unstable or hot; Spotter availability; Ground surface conditions; Weather conditions", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Location of the work area", // Work area assessment
      "Specific details of the task", // Task requirements
      "The travel path of the Order Picker", // Route planning
      "Size and type of the Order Picker", // Equipment specifications
      "Capacity of the Order Picker", // Load capacity limits
      "Equipment/attachments required for the task", // Required accessories
      "Availability of the equipment", // Equipment availability
      "Method of attachment", // Attachment procedures
      "Characteristics (size, weight, shape) of the load", // Load properties
      "Pick up and unloading destinations", // Destination planning
      "Is traffic control/an exclusion zone required?", // Traffic management
      "Adequate and safe communications", // Communication planning
      "Type of load – e.g. flammable, fragile, unstable or hot", // Load hazard assessment
      "Spotter availability", // Support personnel
      "Ground surface conditions", // Surface assessment
      "Weather conditions"     // Environmental factors
    ],
    inputFields: 6              // User needs to provide six answers
  },
  {
    id: 10,                     // Tenth question identifier
    question: "What is the definition of a Hazard?", // Question about hazard definition
    answer: "It is a thing or situation that has the potential to cause harm to a person or cause damage", // Definition of hazard
    acceptableAnswers: [        // Array of all individually acceptable answers
      "It is a thing or situation that has the potential to cause harm to a person or cause damage" // Standard definition
    ],
    inputFields: 2              // User needs to provide two answers (likely for a complete definition)
  },
  {
    id: 11,                     // Eleventh question identifier
    question: "What is the definition of a Risk?", // Question about risk definition
    answer: "It is the possibility that harm (death, injury or illness) might happen when exposed to a hazard", // Definition of risk
    acceptableAnswers: [        // Array of all individually acceptable answers
      "It is the possibility that harm (death, injury or illness) might happen when exposed to a hazard" // Standard definition
    ],
    inputFields: 2              // User needs to provide two answers (likely for a complete definition)
  },
  {
    id: 12,                     // Twelfth question identifier
    question: "Complete the order of the Hierarchy of Controls below:", // Question about hierarchy of controls
    answer: "Elimination; Substitution; Isolation; Engineering Controls; Administrative Controls; PPE", // Ordered list of controls
    acceptableAnswers: [        // Array of all individually acceptable answers in correct order
      "Elimination",            // Most effective control - removing the hazard
      "Substitution",           // Replacing the hazard with something less hazardous
      "Isolation",              // Isolating people from the hazard
      "Engineering Controls",   // Modifying equipment to reduce risk
      "Administrative Controls", // Changing work procedures
      "PPE"                     // Personal Protective Equipment - least effective control
    ],
    inputFields: 6,             // User needs to provide six answers
    displayFormat: 'hierarchy'  // Special display format for hierarchical information
  },
  {
    id: 13,                     // Thirteenth question identifier
    question: "List ten (10) hazards that relate to Order Picking Forklift operations that could be identified prior to operating", // Question about forklift hazards
    answer: "Overhead power lines; Ground surface conditions; Weather conditions; Rear end swing; Pedestrians; Batteries; Load stability; Unfamiliar equipment; Poor lighting; Communication failures", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Overhead power lines",   // Electrical hazards above
      "Ground surface conditions", // Floor/ground hazards
      "Weather conditions",     // Environmental factors
      "Rear end swing",         // Equipment movement hazard
      "Pedestrians",            // People in work area
      "Batteries",              // Power source hazards
      "Load stability",         // Unstable load risks
      "Unfamiliar equipment",   // New equipment risks
      "Poor lighting",          // Visibility issues
      "Communication failures"  // Communication problems
    ],
    inputFields: 10             // User needs to provide ten answers
  },
  {
    id: 14,                     // Fourteenth question identifier
    question: "What should the operator do if the Order Picking Forklift makes contact with an electrical source? (E.g. power supply to lights) List two (2) actions", // Question about electrical emergency
    answer: "Stay on the Order Picker; Warn others to stay away", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Stay on the Order Picker", // Remain on equipment to avoid ground contact
      "Warn others to stay away", // Alert others to danger
      "Avoid touching anything on the Order Picker", // Prevent additional contact
      "Ensure power has been disconnected before leaving" // Verify power is off before exiting
    ],
    inputFields: 2              // User needs to provide two answers
  },
  {
    id: 15,                     // Fifteenth question identifier
    question: "If the ground is wet and slippery, what are two (2) things we need to do?", // Question about wet conditions
    answer: "Reduce speed; Avoid sudden braking", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Reduce speed",           // Slow down for conditions
      "Avoid sudden braking",   // Prevent skidding
      "Proceed with caution"    // General caution
    ],
    inputFields: 2              // User needs to provide two answers
  },
  {
    id: 16,                     // Sixteenth question identifier
    question: "Why is the rear of the Order Picking Forklift dangerous when it turns?", // Question about turning hazards
    answer: "Because the rear swings wider than the front when turning", // Main answer about rear swing
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Because the rear swings wider than the front when turning", // Swing radius explanation
      "The rear turns up to three and a half times faster than the speed of forward travel" // Speed differential explanation
    ],
    inputFields: 1              // User needs to provide one answer
  },
  {
    id: 17,                     // Seventeenth question identifier
    question: "What are three (3) safe ways to operate an Order Picker on wet slippery surfaces?", // Question about wet surface operation
    answer: "Reduce speed; Avoid sudden movements; Increase following distance", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Reduce speed",           // Lower operating speed
      "Avoid sudden movements", // Smooth operation
      "Increase following distance", // Greater spacing
      "Use extra caution when turning" // Careful turning
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 18,                     // Eighteenth question identifier
    question: "List three (3) types of weather hazards that could affect Order Picker operations outdoors", // Question about weather hazards
    answer: "High winds; Heavy rain; Extreme heat", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "High winds",             // Wind hazards
      "Heavy rain",             // Rain hazards
      "Extreme heat",           // Heat hazards
      "Fog/low visibility",     // Visibility hazards
      "Ice/snow"                // Winter condition hazards
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 19,                     // Nineteenth question identifier
    question: "What are three (3) hazards associated with operating attachments?", // Question about attachment hazards
    answer: "Reduced visibility; Changed load center; Increased machine weight", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Reduced visibility",     // Visibility issues
      "Changed load center",    // Balance changes
      "Increased machine weight", // Weight issues
      "Different operating characteristics" // Changed handling
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 20,                     // Twentieth question identifier
    question: "What are three (3) safe operating procedures when traveling with a load?", // Question about load transport
    answer: "Keep load low; Tilt mast back; Observe speed limits", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Keep load low",          // Low center of gravity
      "Tilt mast back",         // Stabilize load
      "Observe speed limits",   // Speed control
      "Watch for overhead obstructions" // Overhead awareness
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 21,                     // Twenty-first question identifier
    question: "What are three (3) factors that affect Order Picker stability?", // Question about stability factors
    answer: "Load weight; Load position; Ground conditions", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Load weight",            // Weight impact
      "Load position",          // Position impact
      "Ground conditions",      // Surface impact
      "Travel speed",           // Speed impact
      "Mast height"             // Height impact
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 22,                     // Twenty-second question identifier
    question: "What is the stability triangle and why is it important?", // Question about stability concept
    answer: "The area formed by the front wheels and pivot point that determines the machine's stability limits", // Definition of stability triangle
    acceptableAnswers: [        // Array of all individually acceptable answers
      "The area formed by the front wheels and pivot point that determines the machine's stability limits" // Technical explanation
    ],
    inputFields: 1              // User needs to provide one answer
  },
  {
    id: 23,                     // Twenty-third question identifier
    question: "What are three (3) causes of Order Picker tip-overs?", // Question about tip-over causes
    answer: "Overloading; Turning too sharply; Operating on uneven surfaces", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Overloading",            // Excessive weight
      "Turning too sharply",    // Sharp turns
      "Operating on uneven surfaces", // Uneven ground
      "Lifting loads too high"  // Excessive height
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 24,                     // Twenty-fourth question identifier
    question: "What should you do if the Order Picker starts to tip over?", // Question about emergency response
    answer: "Stay in the operator compartment, hold on firmly, and lean away from the direction of tip", // Safety procedure
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Stay in the operator compartment, hold on firmly, and lean away from the direction of tip" // Emergency response
    ],
    inputFields: 1              // User needs to provide one answer
  },
  {
    id: 25,                     // Twenty-fifth question identifier
    question: "What are three (3) safe operating procedures when working on ramps or inclines?", // Question about incline operation
    answer: "Drive straight up/down; Keep load uphill; Avoid turning on slopes", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Drive straight up/down", // Straight path
      "Keep load uphill",       // Load positioning
      "Avoid turning on slopes", // No turning
      "Reduce speed"            // Speed control
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 26,                     // Twenty-sixth question identifier
    question: "What are three (3) procedures for safely picking up a load?", // Question about load pickup
    answer: "Center load on forks; Check load stability; Verify weight capacity", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Center load on forks",   // Proper positioning
      "Check load stability",   // Stability check
      "Verify weight capacity", // Weight verification
      "Ensure clear travel path" // Path clearance
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 27,                     // Twenty-seventh question identifier
    question: "What are three (3) procedures for safely placing a load?", // Question about load placement
    answer: "Approach slowly; Level forks before placing; Verify placement is secure", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Approach slowly",        // Careful approach
      "Level forks before placing", // Proper fork position
      "Verify placement is secure", // Secure placement
      "Check for stability"     // Stability verification
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 28,                     // Twenty-eighth question identifier
    question: "What are three (3) hazards when stacking loads?", // Question about stacking hazards
    answer: "Unstable stacks; Overhead obstructions; Limited visibility", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Unstable stacks",        // Stack stability issues
      "Overhead obstructions",  // Overhead hazards
      "Limited visibility",     // Visibility problems
      "Falling objects"         // Falling object hazards
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 29,                     // Twenty-ninth question identifier
    question: "What are three (3) safe procedures when working around pedestrians?", // Question about pedestrian safety
    answer: "Maintain safe distance; Use horn at blind spots; Stop if pedestrians are near", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Maintain safe distance", // Distance maintenance
      "Use horn at blind spots", // Warning signals
      "Stop if pedestrians are near", // Stopping for safety
      "Establish eye contact"   // Visual communication
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 30,                     // Thirtieth question identifier
    question: "What are three (3) types of signs or markings you might see in a workplace?", // Question about workplace signage
    answer: "Speed limit signs; Pedestrian crossing markings; Loading zone signs", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Speed limit signs",      // Speed restrictions
      "Pedestrian crossing markings", // Pedestrian areas
      "Loading zone signs",     // Loading areas
      "Overhead clearance signs" // Height restrictions
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 31,                     // Thirty-first question identifier
    question: "What are three (3) procedures for safely parking an Order Picker?", // Question about parking procedures
    answer: "Lower forks to floor; Apply parking brake; Turn off power", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Lower forks to floor",   // Fork positioning
      "Apply parking brake",    // Brake application
      "Turn off power",         // Power shutdown
      "Remove key (if applicable)" // Key security
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 32,                     // Thirty-second question identifier
    question: "What are three (3) shutdown procedures for an Order Picker?", // Question about shutdown procedures
    answer: "Park in designated area; Complete inspection; Report any issues", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Park in designated area", // Proper parking
      "Complete inspection",    // Final inspection
      "Report any issues",      // Issue reporting
      "Secure the machine"      // Security measures
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 33,                     // Thirty-third question identifier
    question: "What are three (3) post-operational checks that must be conducted?", // Question about post-operation checks
    answer: "Check for damage; Record operating hours; Inspect safety devices", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Check for damage",       // Damage inspection
      "Record operating hours", // Hour logging
      "Inspect safety devices", // Safety check
      "Verify fluid levels"     // Fluid level check
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 34,                     // Thirty-fourth question identifier
    question: "What are three (3) types of documentation that must be completed?", // Question about required documentation
    answer: "Pre-operation checklist; Maintenance log; Incident reports", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Pre-operation checklist", // Pre-use documentation
      "Maintenance log",        // Maintenance records
      "Incident reports",       // Incident documentation
      "Load inspection records" // Load records
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 35,                     // Thirty-fifth question identifier
    question: "What are three (3) emergency procedures you should be aware of?", // Question about emergency procedures
    answer: "Emergency shutdown; Evacuation routes; First aid locations", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Emergency shutdown",     // Equipment shutdown
      "Evacuation routes",      // Exit paths
      "First aid locations",    // Medical aid locations
      "Fire extinguisher locations" // Fire safety equipment
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 36,                     // Thirty-sixth question identifier
    question: "What should you do in case of an accident or incident?", // Question about incident response
    answer: "Secure the area, report to supervisor, complete incident report", // Complete procedure
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Secure the area, report to supervisor, complete incident report" // Standard procedure
    ],
    inputFields: 1              // User needs to provide one answer
  },
  {
    id: 37,                     // Thirty-seventh question identifier
    question: "What are three (3) types of loads that require special handling?", // Question about special loads
    answer: "Dangerous goods; Oversized loads; Fragile items", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Dangerous goods",        // Hazardous materials
      "Oversized loads",        // Large dimension loads
      "Fragile items",          // Breakable items
      "Temperature-sensitive loads" // Climate-controlled items
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 38,                     // Thirty-eighth question identifier
    question: "What are three (3) procedures for handling dangerous goods?", // Question about dangerous goods
    answer: "Check SDS; Use proper PPE; Follow segregation rules", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Check SDS",              // Safety Data Sheet review
      "Use proper PPE",         // Personal Protective Equipment
      "Follow segregation rules", // Separation requirements
      "Verify compatibility"    // Chemical compatibility
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 39,                     // Thirty-ninth question identifier
    question: "What are three (3) types of communication methods used in the workplace?", // Question about communication methods
    answer: "Hand signals; Two-way radios; Warning alarms", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Hand signals",           // Manual signals
      "Two-way radios",         // Radio communication
      "Warning alarms",         // Audible warnings
      "Visual displays"         // Visual indicators
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 40,                     // Fortieth question identifier
    question: "What are three (3) procedures for working in confined spaces?", // Question about confined spaces
    answer: "Check ventilation; Maintain clear exit; Use spotter when needed", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Check ventilation",      // Air circulation
      "Maintain clear exit",    // Exit path
      "Use spotter when needed", // Observer assistance
      "Monitor air quality"     // Air quality check
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 41,                     // Forty-first question identifier
    question: "What are three (3) procedures for working at night or in poor visibility?", // Question about low visibility
    answer: "Use all lights; Reduce speed; Increase scanning", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Use all lights",         // Lighting usage
      "Reduce speed",           // Speed reduction
      "Increase scanning",      // Visual awareness
      "Use spotter when needed" // Observer assistance
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 42,                     // Forty-second question identifier
    question: "What are three (3) procedures for working in wet conditions?", // Question about wet conditions
    answer: "Check tire traction; Increase stopping distance; Avoid sudden moves", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Check tire traction",    // Traction verification
      "Increase stopping distance", // Extended stopping
      "Avoid sudden moves",     // Smooth operation
      "Watch for hydroplaning"  // Water hazard awareness
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 43,                     // Forty-third question identifier
    question: "What are three (3) procedures for working in cold storage areas?", // Question about cold environments
    answer: "Wear proper clothing; Check for ice buildup; Monitor exposure time", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Wear proper clothing",   // Appropriate attire
      "Check for ice buildup",  // Ice hazard check
      "Monitor exposure time",  // Time limitation
      "Watch for condensation"  // Moisture awareness
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 44,                     // Forty-fourth question identifier
    question: "What are three (3) procedures for working with pallets?", // Question about pallet handling
    answer: "Inspect pallet condition; Center load properly; Verify weight limits", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Inspect pallet condition", // Condition check
      "Center load properly",   // Load positioning
      "Verify weight limits",   // Weight verification
      "Check for damage"        // Damage inspection
    ],
    inputFields: 3              // User needs to provide three answers
  },
  {
    id: 45,                     // Forty-fifth question identifier
    question: "What are three (3) types of pallet damage that make them unsafe to use?", // Question about pallet damage
    answer: "Broken boards; Missing blocks; Protruding nails", // Combined reference answer
    acceptableAnswers: [        // Array of all individually acceptable answers
      "Broken boards",          // Board damage
      "Missing blocks",         // Support block issues
      "Protruding nails",       // Nail hazards
      "Split stringers"         // Stringer damage
    ],
    inputFields: 3
  },
  {
    id: 46,
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
    id: 47,
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
    id: 48,
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
    id: 49,
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
    id: 50,
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
    id: 51,
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
    id: 52,
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
    id: 53,
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
    id: 54,
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
    id: 55,
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
    id: 56,
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
    id: 57,
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
    id: 58,
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
    id: 59,
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
    id: 60,
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
    id: 61,
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
    id: 62,
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
    id: 63,
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
    id: 64,
    question: "What are three (3) procedures for working with explosive loads?",
    answer: "Follow special procedures; Maintain safe distance; Use proper equipment",
    acceptableAnswers: [
      "Follow special procedures",
      "Maintain safe distance",
      "Use proper equipment",
      "Monitor for hazards"
    ],
    inputFields: 3
  },
  {
    id: 65,
    question: "What are three (3) procedures for working with radioactive loads?",
    answer: "Follow radiation protocols; Use shielding; Monitor exposure",
    acceptableAnswers: [
      "Follow radiation protocols",
      "Use shielding",
      "Monitor exposure",
      "Wear dosimeter"
    ],
    inputFields: 3
  },
  {
    id: 66,
    question: "Why must batteries be charged in a well ventilated area?",
    answer: "To prevent buildup of explosive hydrogen gas during charging",
    acceptableAnswers: [
      "To prevent buildup of explosive hydrogen gas during charging"
    ],
    inputFields: 1
  },
  {
    id: 67,
    question: "What are three (3) procedures for working with compressed gas cylinders?",
    answer: "Secure cylinders properly; Keep valves protected; Use proper handling equipment",
    acceptableAnswers: [
      "Secure cylinders properly",
      "Keep valves protected",
      "Use proper handling equipment",
      "Store upright"
    ],
    inputFields: 3
  },
  {
    id: 68,
    question: "What are three (3) procedures for working with bulk liquids?",
    answer: "Check container integrity; Secure properly; Avoid sudden movements",
    acceptableAnswers: [
      "Check container integrity",
      "Secure properly",
      "Avoid sudden movements",
      "Monitor for leaks"
    ],
    inputFields: 3
  },
  {
    id: 69,
    question: "What are three (3) procedures for working with food products?",
    answer: "Maintain hygiene standards; Follow temperature controls; Handle carefully",
    acceptableAnswers: [
      "Maintain hygiene standards",
      "Follow temperature controls",
      "Handle carefully",
      "Use proper containers"
    ],
    inputFields: 3
  },
  {
    id: 70,
    question: "What are three (3) procedures for working with pharmaceutical products?",
    answer: "Follow handling instructions; Maintain required conditions; Document movements",
    acceptableAnswers: [
      "Follow handling instructions",
      "Maintain required conditions",
      "Document movements",
      "Use proper packaging"
    ],
    inputFields: 3
  },
  {
    id: 71,
    question: "What are three (3) procedures for working with electronic equipment?",
    answer: "Handle carefully; Protect from static; Use proper packaging",
    acceptableAnswers: [
      "Handle carefully",
      "Protect from static",
      "Use proper packaging",
      "Avoid moisture"
    ],
    inputFields: 3
  },
  {
    id: 72,
    question: "What are three (3) procedures for working with construction materials?",
    answer: "Check load stability; Use proper attachments; Secure properly",
    acceptableAnswers: [
      "Check load stability",
      "Use proper attachments",
      "Secure properly",
      "Follow weight limits"
    ],
    inputFields: 3
  }
];