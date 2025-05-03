// This file contains the configuration for role-based questions in the lead form
// Each role has its own set of questions that will be displayed in the form

// Define the common fields that are required for all roles
export const commonFields = [
  {
    id: 'first_name',
    label: 'Voornaam',
    type: 'text',
    placeholder: 'Voer je voornaam in',
    required: false,
    validation: {}
  },
  {
    id: 'last_name',
    label: 'Achternaam',
    type: 'text',
    placeholder: 'Voer je achternaam in',
    required: false,
    validation: {}
  },
  {
    id: 'email',
    label: 'E-mailadres',
    type: 'email',
    placeholder: 'Voer je e-mailadres in',
    required: false,
    validation: {}
  },
  {
    id: 'phone',
    label: 'Telefoonnummer',
    type: 'tel',
    placeholder: 'Voer je telefoonnummer in',
    required: false,
    validation: {}
  },
  {
    id: 'birth_date',
    label: 'Geboortedatum',
    type: 'date',
    placeholder: 'Selecteer je geboortedatum',
    required: false
  },
  {
    id: 'city',
    label: 'Woonplaats',
    type: 'text',
    placeholder: 'Voer je woonplaats in',
    required: false
  },
  {
    id: 'referral_code',
    label: 'Referral Code (optioneel)',
    type: 'text',
    placeholder: 'Heb je een referral code?',
    required: false
  }
];

// Define role-specific questions
export const roleBasedQuestions = {
  // Member role questions
  member: [
    {
      id: 'investment_experience',
      label: 'Hoeveel ervaring heb je met investeren?',
      type: 'select',
      options: [
        { value: 'none', label: 'Geen ervaring' },
        { value: 'beginner', label: 'Beginner (< 1 jaar)' },
        { value: 'intermediate', label: 'Gemiddeld (1-3 jaar)' },
        { value: 'advanced', label: 'Gevorderd (3+ jaar)' }
      ],
      required: false,
      validation: {}
    },
    {
      id: 'investment_amount',
      label: 'Hoeveel ben je van plan te investeren?',
      type: 'select',
      options: [
        { value: 'less_than_5k', label: 'Minder dan €5.000' },
        { value: '5k_to_25k', label: '€5.000 - €25.000' },
        { value: '25k_to_100k', label: '€25.000 - €100.000' },
        { value: 'more_than_100k', label: 'Meer dan €100.000' }
      ],
      required: false,
      validation: {}
    }
  ],
  
  // Ouder (parent) role questions
  ouder: [
    {
      id: 'child_age',
      label: 'Wat is de leeftijd van je kind?',
      type: 'select',
      options: [
        { value: '0_to_5', label: '0-5 jaar' },
        { value: '6_to_12', label: '6-12 jaar' },
        { value: '13_to_17', label: '13-17 jaar' },
        { value: '18_plus', label: '18+ jaar' }
      ],
      required: false,
      validation: {}
    },
    {
      id: 'investment_timeframe',
      label: 'Wat is je investeringstermijn?',
      type: 'select',
      options: [
        { value: 'short_term', label: 'Korte termijn (< 5 jaar)' },
        { value: 'medium_term', label: 'Middellange termijn (5-10 jaar)' },
        { value: 'long_term', label: 'Lange termijn (> 10 jaar)' }
      ],
      required: false,
      validation: {}
    }
  ],
  
  // Student role questions
  student: [
    {
      id: 'education_level',
      label: 'Wat is je huidige opleidingsniveau?',
      type: 'select',
      options: [
        { value: 'high_school', label: 'Middelbare school' },
        { value: 'mbo', label: 'MBO' },
        { value: 'hbo', label: 'HBO' },
        { value: 'university', label: 'Universiteit' },
        { value: 'other', label: 'Anders' }
      ],
      required: false,
      validation: {}
    },
    {
      id: 'field_of_study',
      label: 'Wat is je studierichting?',
      type: 'text',
      placeholder: 'Bijvoorbeeld: economie, techniek',
      required: false,
      validation: {}
    },
    {
      id: 'investment_knowledge',
      label: 'Hoeveel weet je al van investeren?',
      type: 'select',
      options: [
        { value: 'none', label: 'Niets' },
        { value: 'basic', label: 'Basis' },
        { value: 'intermediate', label: 'Gemiddeld' },
        { value: 'advanced', label: 'Gevorderd' }
      ],
      required: false,
      validation: {}
    },
    {
      id: 'start_amount',
      label: 'Met welk bedrag wil je beginnen met investeren?',
      type: 'select',
      options: [
        { value: 'less_than_500', label: 'Minder dan €500' },
        { value: '500_to_1000', label: '€500 - €1.000' },
        { value: '1000_to_5000', label: '€1.000 - €5.000' },
        { value: 'more_than_5000', label: 'Meer dan €5.000' }
      ],
      required: false,
      validation: {}
    }
  ]
};

// Helper function to get questions for a specific role
export const getQuestionsForRole = (role) => {
  if (!roleBasedQuestions[role]) {
    throw new Error(`Invalid role: ${role}`);
  }
  
  // Return common fields and role-specific questions
  return [...commonFields, ...roleBasedQuestions[role]];
};

// Helper function to organize questions into form steps
export const getFormStepsForRole = (role) => {
  const allQuestions = getQuestionsForRole(role);
  
  // Step 1: Personal information
  const personalInfoFields = allQuestions.filter(field => 
    ['first_name', 'last_name', 'email', 'phone'].includes(field.id)
  );
  
  // Step 2: Additional information
  const additionalInfoFields = allQuestions.filter(field => 
    ['birth_date', 'city', 'referral_code'].includes(field.id)
  );
  
  // Step 3: Role-specific questions
  const roleSpecificFields = allQuestions.filter(field => 
    !['first_name', 'last_name', 'email', 'phone', 'birth_date', 'city', 'referral_code'].includes(field.id)
  );
  
  return [
    {
      title: 'Persoonlijke Informatie',
      fields: personalInfoFields
    },
    {
      title: 'Aanvullende Informatie',
      fields: additionalInfoFields
    },
    {
      title: `${role.charAt(0).toUpperCase() + role.slice(1)} Specifieke Informatie`,
      fields: roleSpecificFields
    }
  ];
};
