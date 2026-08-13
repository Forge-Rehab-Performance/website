export type FaqQuestion = readonly [question: string, answer: string];

export interface FaqCategory {
  id: string;
  title: string;
  questions: readonly FaqQuestion[];
}

export const faqCategories = [
  {
    id: 'about',
    title: 'About Forge Rehab & Performance',
    questions: [
      ['What is Forge Rehab & Performance?', 'Forge Rehab & Performance is a one-on-one physical therapy practice designed for active individuals, athletes, and weekend warriors. Treatment combines hands-on physical therapy, individualized exercise, strength training, and performance-based rehabilitation to help you recover, build, and perform at your best.'],
      ['Who do you treat?', 'We work with active adults, recreational athletes, competitive athletes, and anyone looking to move better, get stronger, recover from injury, or return to the activities they enjoy.'],
      ['Do I need to be an athlete to come to Forge?', 'Not at all. You don’t need to be a competitive athlete or even consider yourself an athlete. If you’re active and want to move, feel, and perform better, Forge is built for you.'],
    ],
  },
  {
    id: 'treatment',
    title: 'Physical Therapy & Treatment',
    questions: [
      ['What can I expect at my first visit?', 'Your first visit includes a comprehensive evaluation to understand your injury, symptoms, movement, strength, and goals. We’ll discuss what is contributing to the problem and develop an individualized plan to get you back to the activities that matter to you. Your evaluation will also include treatment when appropriate, so you can leave with a clear understanding of what we’re working toward and what you can do between visits.'],
      ['How long are appointments?', 'Appointments are designed to provide individualized, one-on-one care rather than the rushed experience common in traditional high-volume clinics. Your exact appointment length may vary based on your needs and the type of visit.'],
      ['Will I work directly with the physical therapist?', 'Yes. Every visit is one-on-one with your physical therapist. You will not be passed between multiple providers or placed on exercise equipment and left on your own.'],
      ['Do I need a referral from my doctor?', 'New Jersey allows patients to seek physical therapy directly in many circumstances. However, certain insurance, medical, or clinical situations may still require physician involvement. If you’re unsure whether physical therapy is appropriate for you, contact us and we’ll help determine the best next step.'],
      ['What types of injuries do you treat?', 'We treat a wide range of orthopedic and musculoskeletal conditions, including back and neck pain; shoulder injuries; knee pain and injuries; hip and groin problems; ankle and foot injuries; sports injuries; post-operative rehabilitation; muscle strains and tendon injuries; running-related injuries; strength and movement deficits; and return-to-sport and return-to-performance needs.'],
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance & Payment',
    questions: [
      ['Do you accept insurance?', 'Forge Rehab & Performance operates primarily as an out-of-network physical therapy practice. This allows us to focus on individualized care without the restrictions and high-volume requirements of traditional insurance-based clinics.'],
      ['Can I use my out-of-network insurance benefits?', 'Depending on your insurance plan, you may be eligible for reimbursement for out-of-network physical therapy services. We can provide you with the documentation you need to submit to your insurance company. Because every insurance plan is different, we recommend contacting your insurance provider to understand your specific out-of-network benefits, deductible, and reimbursement policies.'],
      ['Why don’t you bill my insurance directly?', 'Operating outside of the traditional insurance model allows us to spend more time with each patient and tailor treatment around your goals rather than insurance restrictions.'],
      ['What forms of payment do you accept?', 'We accept major forms of electronic payment. Payment is due at the time of service unless otherwise arranged.'],
      ['Can I use my HSA or FSA?', 'Physical therapy services are generally eligible for HSA/FSA spending, although individual plan rules vary. We recommend confirming eligibility with your plan administrator.'],
    ],
  },
  {
    id: 'packages',
    title: 'Pricing & Packages',
    questions: [
      ['How much does physical therapy cost?', 'Initial Evaluation — $225. Follow-Up Visit — $175. Prepaid care packages are also available: Recover — $700, Build — $1,000, and Perform — $1,300. Package details and savings are available on our Pricing page.'],
      ['Do I have to purchase a package?', 'No. Packages are completely optional. You can pay for visits individually and decide how you’d like to proceed after your evaluation.'],
      ['How do I know how many visits I’ll need?', 'That depends on your injury, goals, and how you respond to treatment. We’ll discuss your expected plan of care after your evaluation rather than automatically scheduling you for a predetermined number of visits.'],
    ],
  },
  {
    id: 'difference',
    title: 'The Forge Difference',
    questions: [
      ['Why is Forge located inside a gym?', 'Because rehabilitation shouldn’t stop when you leave the treatment table. Being located inside a training environment allows us to transition seamlessly from hands-on treatment and movement assessment into strength, conditioning, and functional exercise.'],
      ['Do I need to be a member of the gym?', 'No. Your physical therapy services at Forge are separate from gym membership.'],
      ['Will I be able to use the gym equipment during my treatment?', 'Yes. Your treatment may incorporate the gym’s available strength and conditioning equipment when appropriate for your rehabilitation and goals.'],
      ['Is Forge just physical therapy or is it personal training?', 'Forge is a physical therapy practice. Treatment is provided by a licensed physical therapist and is individualized based on your injury, movement limitations, and goals. For appropriate patients, rehabilitation can progress into strength and performance-focused training as part of the return-to-activity process.'],
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    questions: [
      ['What should I wear to my first appointment?', 'Wear comfortable athletic clothing that allows us to evaluate the area you’re having trouble with and observe your movement.'],
      ['What should I bring to my first visit?', 'If applicable, bring any relevant imaging reports, surgical information, physician notes, or other medical documentation. Most importantly, come prepared to talk about what you’re experiencing and what you want to get back to doing.'],
      ['How do I schedule an appointment?', 'You can request an appointment through our online scheduling system or contact Forge directly.'],
      ['What if I’m not sure whether physical therapy is right for me?', 'Reach out. We can discuss what’s going on and determine whether an evaluation at Forge makes sense or whether another type of medical care would be more appropriate.'],
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    questions: [
      ['What is your cancellation policy?', 'We understand that things come up. Because appointments are reserved specifically for you, we ask that you provide at least 24 hours’ notice when you need to cancel or reschedule. Appointments cancelled with less than 24 hours’ notice or missed appointments may be subject to a cancellation fee.'],
    ],
  },
] satisfies readonly FaqCategory[];
