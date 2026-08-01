// medicineAiService.js
// Mock AI Service for detecting and recommending generic medicine alternatives

const genericDatabase = [
  {
    composition: 'Paracetamol',
    strength: '500mg',
    form: 'Tablet',
    generics: [
      { name: 'Paracip 500', brand: 'Cipla', price: 12, platform: 'Jan Aushadhi', rating: 4.8, type: 'Lowest Price', deliveryDays: 1, inStock: true },
      { name: 'Crocin 500', brand: 'GSK', price: 18, platform: 'PharmEasy', rating: 4.5, type: 'Best Rated', deliveryDays: 2, inStock: true },
      { name: 'Calpol 500', brand: 'GSK', price: 15, platform: 'Tata 1mg', rating: 4.6, type: 'Best Value', deliveryDays: 1, inStock: true }
    ]
  },
  {
    composition: 'Paracetamol',
    strength: '650mg',
    form: 'Tablet',
    generics: [
      { name: 'Paracetamol 650mg', brand: 'BPPI', price: 15, platform: 'Jan Aushadhi', rating: 4.9, type: 'Lowest Price', deliveryDays: 1, inStock: true },
      { name: 'Macfast 650', brand: 'Macleods', price: 25, platform: 'Netmeds', rating: 4.6, type: 'Best Value', deliveryDays: 2, inStock: true },
      { name: 'Pacimol 650', brand: 'Ipca', price: 28, platform: 'Tata 1mg', rating: 4.5, type: 'Best Rated', deliveryDays: 1, inStock: true }
    ]
  },
  {
    composition: 'Amoxicillin + Clavulanic Acid',
    strength: '625mg',
    form: 'Tablet',
    generics: [
      { name: 'Moxikind-CV 625', brand: 'Mankind', price: 110, platform: 'PharmEasy', rating: 4.7, type: 'Lowest Price', deliveryDays: 1, inStock: true },
      { name: 'Amoxyclav 625', brand: 'BPPI', price: 95, platform: 'Jan Aushadhi', rating: 4.5, type: 'Biggest Savings', deliveryDays: 2, inStock: true },
      { name: 'Sensiclav 625', brand: 'Macleods', price: 120, platform: 'Tata 1mg', rating: 4.6, type: 'Best Value', deliveryDays: 1, inStock: true }
    ]
  },
  {
    composition: 'Calcium + Vitamin D3',
    strength: '500mg',
    form: 'Tablet',
    generics: [
      { name: 'Calcium & Vitamin D3', brand: 'BPPI', price: 40, platform: 'Jan Aushadhi', rating: 4.8, type: 'Lowest Price', deliveryDays: 2, inStock: true },
      { name: 'Cipcal 500', brand: 'Cipla', price: 65, platform: 'Netmeds', rating: 4.6, type: 'Best Value', deliveryDays: 1, inStock: true },
      { name: 'Gemcal 500', brand: 'Alkem', price: 70, platform: 'Apollo Pharmacy', rating: 4.7, type: 'Best Rated', deliveryDays: 1, inStock: true }
    ]
  }
];

export const getGenericAlternatives = (med) => {
  if (!med || !med.composition) return [];
  
  // Extract strength if available in the name or composition
  // For demo purposes, we do a basic matching logic.
  let strength = '';
  if (med.name.includes('650')) strength = '650mg';
  else if (med.name.includes('500')) strength = '500mg';
  else if (med.name.includes('625')) strength = '625mg';

  // Find matching generic profile
  const match = genericDatabase.find(
    g => g.composition.toLowerCase() === med.composition.toLowerCase() && 
         g.form.toLowerCase() === med.type.toLowerCase() &&
         (strength === '' || g.strength === strength)
  );

  if (!match) return [];

  return {
    composition: match.composition,
    strength: match.strength,
    form: match.form,
    alternatives: match.generics
  };
};
