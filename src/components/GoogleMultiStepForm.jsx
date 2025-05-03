import React, { useState } from 'react';

// Entry IDs from Google Forms
const ENTRY_IDS = {
  gender: 'entry.1006556362',
  birthdate: 'entry.155384768',
  firstName: 'entry.1746723131',
  lastName: 'entry.292573707',
  email: 'entry.558123741',
  phone: 'entry.734673774',
  city: 'entry.121550900',
  roles: 'entry.1618100144', // Multiple possible
  referral: 'entry.1763835973',
  consent: 'entry.799498030', // Multiple possible
};

const ROLE_OPTIONS = [
  'Member',
  'Freelancer',
  'Ondernemer',
  'Student',
  'Ouder',
  'Affiliatie',
];

const CONSENT_OPTIONS = [
  'Ik ga akkoord met de algemene voorwaarden en privacyverklaring.',
  'Ik geef toestemming voor het verwerken van mijn gegevens ten behoeve van onboarding.'
];

const TOTAL_STEPS = 10;

export default function GoogleMultiStepForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    gender: '',
    birthdate: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    roles: [],
    referral: '',
    consent: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'roles') {
        setForm((prev) => ({
          ...prev,
          roles: checked
            ? [...prev.roles, value]
            : prev.roles.filter((v) => v !== value),
        }));
      } else if (name === 'consent') {
        setForm((prev) => ({
          ...prev,
          consent: checked
            ? [...prev.consent, value]
            : prev.consent.filter((v) => v !== value),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    setError('');
    // Validatie per stap
    switch (step) {
      case 0:
        if (!form.gender) return setError('Selecteer geslacht.');
        break;
      case 1:
        if (!form.birthdate) return setError('Vul geboortedatum in.');
        break;
      case 2:
        if (!form.firstName) return setError('Vul voornaam in.');
        break;
      case 3:
        if (!form.lastName) return setError('Vul achternaam in.');
        break;
      case 4:
        if (!form.email) return setError('Vul e-mailadres in.');
        break;
      case 5:
        if (!form.phone) return setError('Vul telefoonnummer in.');
        break;
      case 6:
        if (!form.city) return setError('Vul woonplaats in.');
        break;
      case 7:
        if (!form.roles.length) return setError('Selecteer minstens één rol.');
        break;
      case 9:
        if (!form.consent.length) return setError('Selecteer minstens één optie.');
        break;
      default:
        break;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const prevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.consent.length) {
      setError('Selecteer minstens één optie.');
      return;
    }
    // Bouw form data
    const formData = new FormData();
    formData.append(ENTRY_IDS.gender, form.gender);
    formData.append(ENTRY_IDS.birthdate, form.birthdate);
    formData.append(ENTRY_IDS.firstName, form.firstName);
    formData.append(ENTRY_IDS.lastName, form.lastName);
    formData.append(ENTRY_IDS.email, form.email);
    formData.append(ENTRY_IDS.phone, form.phone);
    formData.append(ENTRY_IDS.city, form.city);
    form.roles.forEach((role) => formData.append(ENTRY_IDS.roles, role));
    if (form.referral) formData.append(ENTRY_IDS.referral, form.referral);
    form.consent.forEach((c) => formData.append(ENTRY_IDS.consent, c));

    fetch('https://docs.google.com/forms/d/e/1FAIpQLSeyohSe-sGPklfyiJSx2_ex5tNbyRPwTFrANqFBQGkquOvVtA/formResponse', {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
    setSubmitted(true);
  };

  // Progress percentage
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  if (submitted) {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-4">Bedankt voor je aanmelding!</h2>
        <p className="text-lg text-gray-700">Je gegevens zijn succesvol verstuurd.</p>
      </div>
    );
  }

  return (
    <form
      className="w-full max-w-2xl mx-auto px-4 py-8 animated-gradient-bg rounded-3xl shadow-2xl border border-gray-100 flex flex-col gap-8 relative transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_8px_32px_0_rgba(128,0,255,0.10)] focus-within:scale-[1.01] focus-within:shadow-[0_8px_32px_0_rgba(128,0,255,0.12)]"
      onSubmit={handleSubmit}
    >
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-center mb-2">
        <span className="text-lg font-semibold text-purple-700">Stap {step + 1} van {TOTAL_STEPS}</span>
      </div>
      {/* Form content */}
      {step === 0 && (
        <div>
          <label className="block mb-4 text-xl font-bold text-gray-800">Geslacht</label>
          <div className="flex gap-8 justify-center">
            <label className="flex items-center gap-2 text-lg cursor-pointer">
              <input type="radio" name="gender" value="Man" checked={form.gender === 'Man'} onChange={handleChange} className="accent-purple-600 scale-125" />
              Man
            </label>
            <label className="flex items-center gap-2 text-lg cursor-pointer">
              <input type="radio" name="gender" value="Vrouw" checked={form.gender === 'Vrouw'} onChange={handleChange} className="accent-purple-600 scale-125" />
              Vrouw
            </label>
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <label className="block mb-2 font-semibold">Geboortedatum</label>
          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 2 && (
        <div>
          <label className="block mb-2 font-semibold">Voornaam</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 3 && (
        <div>
          <label className="block mb-2 font-semibold">Achternaam</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 4 && (
        <div>
          <label className="block mb-2 font-semibold">E-mail</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 5 && (
        <div>
          <label className="block mb-2 font-semibold">Telefoonnummer</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 6 && (
        <div>
          <label className="block mb-2 font-semibold">Woonplaats</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 7 && (
        <div>
          <label className="block mb-2 font-semibold">Gewenste gebruikersrol (meerdere mogelijk)</label>
          <div className="flex flex-wrap gap-4">
            {ROLE_OPTIONS.map((role) => (
              <label key={role} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="roles"
                  value={role}
                  checked={form.roles.includes(role)}
                  onChange={handleChange}
                />
                {role}
              </label>
            ))}
          </div>
        </div>
      )}
      {step === 8 && (
        <div>
          <label className="block mb-2 font-semibold">Referral code (optioneel)</label>
          <input type="text" name="referral" value={form.referral} onChange={handleChange} className="input" />
        </div>
      )}
      {step === 9 && (
        <div>
          <label className="block mb-2 font-semibold">Bevestiging &amp; Toestemming <span className="text-red-500">*</span></label>
          <div className="flex flex-col gap-2">
            {CONSENT_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="consent"
                  value={option}
                  checked={form.consent.includes(option)}
                  onChange={handleChange}
                  required={form.consent.length === 0}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
      {error && <div className="text-red-600 font-semibold text-sm">{error}</div>}
      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-transform duration-150 active:scale-95 focus:scale-105 shadow hover:shadow-md">Vorige</button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button type="button" onClick={nextStep} className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-transform duration-150 active:scale-95 focus:scale-105 shadow hover:shadow-lg">Volgende</button>
        ) : (
          <button type="submit" className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-transform duration-150 active:scale-95 focus:scale-105 shadow hover:shadow-lg">Verzenden</button>
        )}
      </div>
      <div className="text-xs text-gray-400 text-center">Stap {step + 1} van {TOTAL_STEPS}</div>
      <style>{`
        .animated-gradient-bg {
          background: linear-gradient(-45deg, #f8f5ff, #ede9fe, #e9d5ff, #f3e8ff);
          background-size: 300% 300%;
          animation: purpleGradient 16s ease-in-out infinite;
        }
        @keyframes purpleGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 2px #a78bfa33;
        }
      `}</style>
    </form>
  );
}
