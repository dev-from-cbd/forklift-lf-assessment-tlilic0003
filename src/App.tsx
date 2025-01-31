import React, { useState } from 'react';
import { Forklift } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer: string;
  inputFields?: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What are three (3) documented sources you could refer to for workplace safety information?",
    answer: "WHS policies and procedures; Forklift operator manual; Safe working procedures",
    inputFields: 3
  },
  {
    id: 2,
    question: "What are three (3) duties an employer should take to ensure the health and safety of a worker?",
    answer: "Provide and maintain a work environment without risks to health and safety; Provide safe plant and structures; Provide adequate facilities and ensure safe systems of work",
    inputFields: 3
  },
  {
    id: 3,
    question: "After successfully obtaining your High Risk Work Licence, list two (2) things your employer must provide prior to you operating an unfamiliar forklift.",
    answer: "Familiarization training specific to the forklift; Site-specific induction and training",
    inputFields: 2
  },
  {
    id: 4,
    question: "What does the Duty of Care as a worker involve?",
    answer: "Taking reasonable care for your own health and safety; Taking reasonable care not to adversely affect others' health and safety; Complying with reasonable instructions, policies and procedures",
    inputFields: 1
  },
  {
    id: 5,
    question: "What are two (2) things the work health and safety regulator could do if it is found that you were not working safely as a High Risk Work Licence holder?",
    answer: "Suspend or cancel your High Risk Work Licence; Issue fines or penalties",
    inputFields: 2
  },
  {
    id: 6,
    question: "List three (3) people you should talk to about workplace hazards before starting work.",
    answer: "Supervisor; Safety representative; Other workers in the area",
    inputFields: 3
  },
  {
    id: 7,
    question: "Why is it important to consult with others about workplace hazards?",
    answer: "To identify potential risks; To determine appropriate control measures; To ensure everyone is aware of safety procedures",
    inputFields: 1
  },
  {
    id: 8,
    question: "When planning for safe Forklift operations, identify six (6) things you need to consider.",
    answer: "Load weight and dimensions; Travel route and surface conditions; Overhead obstacles; Other traffic and pedestrians; Weather conditions; Workplace procedures and policies",
    inputFields: 6
  },
  {
    id: 9,
    question: "What is the definition of: a Risk and a Hazard?",
    answer: "A Hazard is something that has the potential to cause harm. A Risk is the likelihood that harm will occur from exposure to a hazard",
    inputFields: 1
  },
  {
    id: 10,
    question: "Complete the order of the Hierarchy of Controls below.",
    answer: "1. Elimination 2. Substitution 3. Engineering Controls 4. Administrative Controls 5. Personal Protective Equipment (PPE)",
    inputFields: 5
  },
  {
    id: 11,
    question: "List ten (10) hazards that relate to forklift operations that could be identified prior to operating.",
    answer: "Overhead power lines; Uneven surfaces; Poor lighting; Pedestrian traffic; Other vehicles; Limited visibility; Load stability; Weather conditions; Confined spaces; Workplace obstacles",
    inputFields: 10
  },
  {
    id: 12,
    question: "How can you find out information about the voltage of the power lines?",
    answer: "Contact the electricity supply authority; Check site documentation; Consult with supervisor or site manager",
    inputFields: 1
  },
  {
    id: 13,
    question: "What are the minimum safe distances you must maintain near overhead electric power lines?",
    answer: "Up to 132kV: 3 meters; Between 132kV and 330kV: 6 meters; Above 330kV: 8 meters",
    inputFields: 3
  },
  {
    id: 14,
    question: "List two (2) visual indicators that can identify overhead electric powerlines.",
    answer: "Warning signs; Power line markers; Height clearance signs",
    inputFields: 2
  },
  {
    id: 15,
    question: "What procedure should be followed if contact is made with power conductors? List five (5) steps.",
    answer: "Stay in the forklift; Warn others to stay clear; Contact emergency services; Wait for power to be isolated; Only exit if absolutely necessary and jump clear",
    inputFields: 5
  },
  {
    id: 16,
    question: "What are three (3) safe ways to operate a forklift on wet slippery surfaces?",
    answer: "Reduce speed; Increase following distance; Avoid sudden movements",
    inputFields: 3
  },
  {
    id: 17,
    question: "List three (3) types of weather hazards that could affect forklift operations outdoors.",
    answer: "Rain; Strong winds; Extreme heat",
    inputFields: 3
  },
  {
    id: 18,
    question: "How could obtaining a weather forecast assist in planning forklift operations in an outdoor area?",
    answer: "Help plan work around adverse weather; Prepare appropriate control measures; Schedule high-risk tasks during favorable conditions",
    inputFields: 1
  },
  {
    id: 19,
    question: "What is the danger caused by 'rear end' swing?",
    answer: "The rear of the forklift swings wide when turning, potentially hitting objects or people",
    inputFields: 1
  },
  {
    id: 20,
    question: "What could happen if a load is raised or lowered above people?",
    answer: "The load could fall and cause serious injury or death",
    inputFields: 1
  },
  {
    id: 21,
    question: "Are forklifts designed to carry passengers? Explain your answer.",
    answer: "No, forklifts are not designed to carry passengers. They are only designed for one operator and carrying passengers is unsafe and against regulations",
    inputFields: 1
  },
  {
    id: 22,
    question: "What is the danger of operating a fuel powered forklift in a confined space?",
    answer: "Build-up of toxic exhaust fumes which can cause carbon monoxide poisoning",
    inputFields: 1
  },
  {
    id: 23,
    question: "If you were working in a restricted space with poor ventilation (e.g. cold room), what type of powered forklift would you use?",
    answer: "Electric powered forklift",
    inputFields: 1
  },
  {
    id: 24,
    question: "List three (3) control measures to reduce the interaction of traffic and people in the work area?",
    answer: "Designated pedestrian walkways; Warning signs; Traffic management plan",
    inputFields: 3
  },
  {
    id: 25,
    question: "What must be provided if you are working at night or in a darkened area?",
    answer: "Adequate lighting and high-visibility clothing",
    inputFields: 1
  },
  {
    id: 26,
    question: "How do we communicate with other site personnel? List at least three (3) methods.",
    answer: "Hand signals; Radio communication; Verbal communication; Warning devices",
    inputFields: 3
  },
  {
    id: 27,
    question: "If a co-worker gives you a signal that you do not understand, what should you do?",
    answer: "Stop operations immediately and clarify the signal's meaning before proceeding",
    inputFields: 1
  },
  {
    id: 28,
    question: "If the data plate on the forklift is damaged or unreadable, what should you do?",
    answer: "Stop using the forklift and report it to your supervisor for replacement of the data plate",
    inputFields: 1
  },
  {
    id: 29,
    question: "List eight (8) pre-operational (visual) checks prior to starting the forklift.",
    answer: "Tyres; Forks; Chains; Hydraulic lines; Warning devices; Lights; Mirrors; Safety equipment",
    inputFields: 8
  },
  {
    id: 30,
    question: "List two (2) safety guards on a forklift and what they do.",
    answer: "Overhead guard - protects operator from falling objects; Load backrest - prevents load from falling back onto operator",
    inputFields: 2
  },
  {
    id: 31,
    question: "What can happen to a forklift if air-filled tyres are not inflated to the correct pressures indicated on the data plate?",
    answer: "Reduced stability; Uneven wear; Increased risk of accidents; Decreased load capacity",
    inputFields: 1
  },
  {
    id: 32,
    question: "What defects may be found when inspecting the forklift wheels and tyres? List four (4) defects.",
    answer: "Wear; Cuts; Bulges; Incorrect pressure; Foreign objects; Separation",
    inputFields: 4
  },
  {
    id: 33,
    question: "List two (2) ways a seat belt can protect the operator when worn.",
    answer: "Prevents operator from being thrown from forklift in tip-over; Keeps operator within protective cage in case of accident",
    inputFields: 2
  },
  {
    id: 34,
    question: "What are four (4) operational or electrical checks you should complete after you have started the forklift?",
    answer: "Brakes; Steering; Horn; Lights; Hydraulic controls; Battery charge level",
    inputFields: 4
  },
  {
    id: 35,
    question: "Where is the point of balance (fulcrum) on a forklift?",
    answer: "The front axle acts as the fulcrum point",
    inputFields: 1
  },
  {
    id: 36,
    question: "What effect does the side shift have if it is moved all to one side?",
    answer: "It changes the center of gravity and can affect stability",
    inputFields: 1
  },
  {
    id: 37,
    question: "What could happen if a load was carried on just one fork type? List two (2) things.",
    answer: "Uneven weight distribution; Risk of tipping; Load instability; Damage to load",
    inputFields: 2
  },
  {
    id: 38,
    question: "What is the correct height for the forks when travelling with a load?",
    answer: "150-200mm (6-8 inches) off the ground, or just high enough to clear surface obstacles",
    inputFields: 1
  },
  {
    id: 39,
    question: "What could happen if the forklift travelled with the load raised high?",
    answer: "Reduced stability; Risk of tip-over; Poor visibility; Risk of hitting overhead obstacles",
    inputFields: 1
  },
  {
    id: 40,
    question: "What could you do if your view was obstructed by the load when operating the forklift? List two (2) actions.",
    answer: "Travel in reverse; Use a spotter; Reorganize the load; Use mirrors",
    inputFields: 2
  },
  {
    id: 41,
    question: "Why should the forklift operator always monitor the movement of the load?",
    answer: "To ensure load stability; To detect potential hazards; To prevent accidents",
    inputFields: 1
  },
  {
    id: 42,
    question: "What can be placed to cover the gap between the truck and the loading bay?",
    answer: "Bridge plate or dock leveler",
    inputFields: 1
  },
  {
    id: 43,
    question: "What can happen if you turn or travel sideways with a load on a sloped surface? List two (2).",
    answer: "Forklift can tip over; Load can become unstable and fall; Loss of control",
    inputFields: 2
  },
  {
    id: 44,
    question: "Which direction should the load face when travelling up a slope / ramp?",
    answer: "Load should face uphill when going up, and downhill when going down",
    inputFields: 1
  },
  {
    id: 45,
    question: "What do you need to consider when stacking loads on top of another? List three (3) things.",
    answer: "Load capacity; Stack stability; Surface condition; Height restrictions",
    inputFields: 3
  },
  {
    id: 46,
    question: "List three (3) attachments that can be fitted to a forklift other than fork types.",
    answer: "Drum clamps; Rotators; Jibs; Side shifters; Paper roll clamps",
    inputFields: 3
  },
  {
    id: 47,
    question: "Where would you find the instructions about how to correctly fit an attachment to the forklift?",
    answer: "Manufacturer's manual; Attachment documentation; Operating instructions",
    inputFields: 1
  },
  {
    id: 48,
    question: "How could the use of an attachment affect the load capacity of the forklift?",
    answer: "Attachments reduce the forklift's load capacity due to their weight and changed load center",
    inputFields: 1
  },
  {
    id: 49,
    question: "How can using a jib attachment affect the stability of the forklift?",
    answer: "Increases the load center distance; Reduces stability; Changes weight distribution",
    inputFields: 1
  },
  {
    id: 50,
    question: "List four (4) ways to determine the weight of a load to be lifted.",
    answer: "Check documentation; Weigh the load; Check markings on load; Consult manufacturer's specifications",
    inputFields: 4
  },
  {
    id: 51,
    question: "Calculate the weight of the following load including the pallet: 3 layers of boxes, 9 boxes on each layer, each box weighs 10kg, pallet weighs 40 kg.",
    answer: "Total weight = (3 layers × 9 boxes × 10kg) + 40kg pallet = 310kg",
    inputFields: 1
  },
  {
    id: 52,
    question: "Calculate the weight of the following load including the pallet: 6 drums on a pallet, each drum weighs 110 kg, pallet weighs 40 kg.",
    answer: "Total weight = (6 drums × 110kg) + 40kg pallet = 700kg",
    inputFields: 1
  },
  {
    id: 53,
    question: "Calculate the weight of the following load including the pallet: 30 bags on pallet, each bag weighs 25 kg, the pallet weighs 40 kg.",
    answer: "Total weight = (30 bags × 25kg) + 40kg pallet = 790kg",
    inputFields: 1
  },
  {
    id: 54,
    question: "What would be the effect to the forklift capacity if the load is not rested up against the back rest?",
    answer: "The effective load center increases, reducing the forklift's safe lifting capacity",
    inputFields: 1
  },
  {
    id: 55,
    question: "What is the most common load centre distance?",
    answer: "600mm (24 inches)",
    inputFields: 1
  },
  {
    id: 56,
    question: "Where would you find the rated capacity for a forklift?",
    answer: "On the data plate (capacity plate) attached to the forklift",
    inputFields: 1
  },
  {
    id: 57,
    question: "List four (4) things that could tip the forklift over sideways.",
    answer: "Turning too fast; Uneven ground; Overloading; Driving with raised load",
    inputFields: 4
  },
  {
    id: 58,
    question: "List four (4) things that could cause you to tip the forklift forwards or backwards.",
    answer: "Overloading; Braking too hard; Driving with raised load; Load center too far forward",
    inputFields: 4
  },
  {
    id: 59,
    question: "What should you do if you are in the forklift when it tips over sideways? List two (2) actions.",
    answer: "Stay in the cabin; Brace yourself and lean away from the point of impact; Hold on firmly",
    inputFields: 2
  },
  {
    id: 60,
    question: "What steps would you take if you lost control of the brakes or steering when operating the forklift? List three (3) steps.",
    answer: "Sound horn to warn others; Try to steer to safe area; Shut down engine if possible",
    inputFields: 3
  },
  {
    id: 61,
    question: "List four (4) places not to park your forklift on shutdown.",
    answer: "Emergency exits; Fire equipment access; Pedestrian walkways; Loading zones",
    inputFields: 4
  },
  {
    id: 62,
    question: "List three (3) steps for parking a forklift.",
    answer: "Lower forks to ground; Apply parking brake; Turn off engine and remove key",
    inputFields: 3
  },
  {
    id: 63,
    question: "Why would you remove the key from the ignition after shutdown?",
    answer: "To prevent unauthorized use of the forklift",
    inputFields: 1
  },
  {
    id: 64,
    question: "Does refueling with the engine running create a risk? Why?",
    answer: "Yes, it creates a fire risk due to potential fuel vapors igniting from the hot engine",
    inputFields: 1
  },
  {
    id: 65,
    question: "Why must batteries be charged in a well ventilated area?",
    answer: "To prevent build-up of explosive hydrogen gas produced during charging",
    inputFields: 1
  }
];

function App() {
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({});

  const handleAnswerChange = (questionId: number, index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [index]: value
      }
    }));
  };

  const toggleAnswer = (id: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="bg-blue-900 text-white py-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1620472926326-0fc8946c880d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Forklift size={48} className="mr-4" />
            <h1 className="text-4xl font-bold">Forklift Training & Assessment</h1>
          </div>
          <h2 className="text-2xl text-center">TLILIC0003 High Risk Licence</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-8">
              {questions.map((q) => (
                <div key={q.id} className="border-b pb-6">
                  <div className="mb-4">
                    <span className="font-medium text-lg">{q.id}. </span>
                    <span className="text-lg">{q.question}</span>
                  </div>
                  
                  {q.inputFields ? (
                    <div className="space-y-2">
                      {[...Array(q.inputFields)].map((_, index) => (
                        <div key={index} className="flex items-center">
                          <span className="mr-2 w-6">{index + 1}.</span>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            onChange={(e) => handleAnswerChange(q.id, index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={3}
                      onChange={(e) => handleAnswerChange(q.id, 0, e.target.value)}
                    />
                  )}
                  
                  <button
                    className="mt-4 text-blue-600 hover:text-blue-800"
                    onClick={() => toggleAnswer(q.id)}
                  >
                    {showAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  
                  {showAnswers[q.id] && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <span className="font-medium">Answer: </span>
                      {q.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Forklift Training & Assessment</p>
        </div>
      </footer>
    </div>
  );
}

export default App;