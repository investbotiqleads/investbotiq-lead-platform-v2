// This file contains the configuration for role-based questions in the lead form
// Each role has its own set of questions that will be displayed in the form

// Define the common fields that are required for all roles
export const commonFields = [
  {
    id: 'first_name',
    label: 'Voornaam',
    type: 'text',
    placeholder: 'Voer je voornaam in',
    required: true,
    validation: {
      required: 'Voornaam is verplicht',
      minLength: {
        value: 2,
        message: 'Voornaam moet minimaal 2 karakters bevatten'
      }
    }
  },
  {
    id: 'last_name',
    label: 'Achternaam',
    type: 'text',
    placeholder: 'Voer je achternaam in',
    required: true,
    validation: {
      required: 'Achternaam is verplicht',
      minLength: {
        value: 2,
        message: 'Achternaam moet minimaal 2 karakters bevatten'
      }
    }
  },
  {
    id: 'email',
    label: 'E-mailadres',
    type: 'email',
    placeholder: 'Voer je e-mailadres in',
    required: true,
    validation: {
      required: 'E-mailadres is verplicht',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Ongeldig e-mailadres'
      }
    }
  },
  {
    id: 'phone',
    label: 'Telefoonnummer',
    type: 'tel',
    placeholder: 'Voer je telefoonnummer in',
    required: false,
    validation: {
      pattern: {
        value: /^[0-9+\s()-]{10,15}$/,
        message: 'Ongeldig telefoonnummer'
      }
    }
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
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'investment_goal',
      label: 'Wat is je belangrijkste investeringsdoel?',
      type: 'select',
      options: [
        { value: 'wealth_growth', label: 'Vermogensgroei' },
        { value: 'passive_income', label: 'Passief inkomen' },
        { value: 'retirement', label: 'Pensioen' },
        { value: 'financial_freedom', label: 'Financiële vrijheid' },
        { value: 'other', label: 'Anders' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
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
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    }
  ],
  
  // Freelancer role questions
  freelancer: [
    {
      id: 'expertise',
      label: 'Wat is je expertise?',
      type: 'select',
      options: [
        { value: 'development', label: 'Software Ontwikkeling' },
        { value: 'design', label: 'Design' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'content', label: 'Content Creatie' },
        { value: 'finance', label: 'Financiën' },
        { value: 'other', label: 'Anders' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'experience_years',
      label: 'Hoeveel jaar ervaring heb je?',
      type: 'select',
      options: [
        { value: 'less_than_1', label: 'Minder dan 1 jaar' },
        { value: '1_to_3', label: '1-3 jaar' },
        { value: '3_to_5', label: '3-5 jaar' },
        { value: 'more_than_5', label: 'Meer dan 5 jaar' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'availability',
      label: 'Wat is je beschikbaarheid?',
      type: 'select',
      options: [
        { value: 'part_time', label: 'Part-time' },
        { value: 'full_time', label: 'Full-time' },
        { value: 'project_based', label: 'Project-basis' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'portfolio',
      label: 'Link naar je portfolio of LinkedIn',
      type: 'url',
      placeholder: 'https://',
      required: false,
      validation: {
        pattern: {
          value: /^https?:\/\/.+/,
          message: 'Voer een geldige URL in'
        }
      }
    }
  ],
  
  // Parent role questions
  parent: [
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
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'investment_goal',
      label: 'Wat is je investeringsdoel voor je kind?',
      type: 'select',
      options: [
        { value: 'education', label: 'Opleiding' },
        { value: 'future_security', label: 'Toekomstige zekerheid' },
        { value: 'wealth_building', label: 'Vermogensopbouw' },
        { value: 'other', label: 'Anders' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
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
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
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
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'field_of_study',
      label: 'Wat is je studierichting?',
      type: 'select',
      options: [
        { value: 'business', label: 'Bedrijfskunde/Economie' },
        { value: 'tech', label: 'Techniek/IT' },
        { value: 'science', label: 'Wetenschap' },
        { value: 'arts', label: 'Kunst/Cultuur' },
        { value: 'other', label: 'Anders' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'investment_knowledge',
      label: 'Hoe zou je je kennis over investeren omschrijven?',
      type: 'select',
      options: [
        { value: 'none', label: 'Geen kennis' },
        { value: 'basic', label: 'Basiskennis' },
        { value: 'intermediate', label: 'Gemiddelde kennis' },
        { value: 'advanced', label: 'Gevorderde kennis' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
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
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    }
  ],
  
  // Affiliated role questions
  affiliated: [
    {
      id: 'company_name',
      label: 'Bedrijfsnaam',
      type: 'text',
      placeholder: 'Voer je bedrijfsnaam in',
      required: true,
      validation: {
        required: 'Bedrijfsnaam is verplicht'
      }
    },
    {
      id: 'industry',
      label: 'In welke sector ben je actief?',
      type: 'select',
      options: [
        { value: 'finance', label: 'Financiën' },
        { value: 'tech', label: 'Technologie' },
        { value: 'education', label: 'Onderwijs' },
        { value: 'retail', label: 'Retail' },
        { value: 'other', label: 'Anders' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'partnership_type',
      label: 'Welk type samenwerking zoek je?',
      type: 'select',
      options: [
        { value: 'referral', label: 'Referral Programma' },
        { value: 'co_marketing', label: 'Co-marketing' },
        { value: 'integration', label: 'Product Integratie' },
        { value: 'other', label: 'Anders' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'company_size',
      label: 'Hoe groot is je bedrijf?',
      type: 'select',
      options: [
        { value: 'solo', label: 'Eenmanszaak' },
        { value: 'small', label: 'Klein (2-10 medewerkers)' },
        { value: 'medium', label: 'Middelgroot (11-50 medewerkers)' },
        { value: 'large', label: 'Groot (50+ medewerkers)' }
      ],
      required: true,
      validation: {
        required: 'Dit veld is verplicht'
      }
    },
    {
      id: 'website',
      label: 'Website',
      type: 'url',
      placeholder: 'https://',
      required: false,
      validation: {
        pattern: {
          value: /^https?:\/\/.+/,
          message: 'Voer een geldige URL in'
        }
      }
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
