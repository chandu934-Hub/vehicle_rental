// High-resolution automotive imagery mapped by vehicle category and model
export const vehicleImageMap = {
  // Specific model highlights
  'tesla_model 3': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
  'bmw_3 series': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
  'toyota_rav4': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
  'mercedes-benz_glc': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
  'hyundai_ioniq 5': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80',
  'volkswagen_golf': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
  'honda_odyssey': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
  'ford_f-150': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',

  // Category fallbacks
  SEDAN: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80',
  SUV: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',
  HATCHBACK: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
  VAN: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
  TRUCK: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80'
}

export function getVehicleImage(vehicle) {
  if (!vehicle) return vehicleImageMap.SEDAN

  const make = (vehicle.make || '').toLowerCase().trim()
  const model = (vehicle.model || '').toLowerCase().trim()

  for (const [key, url] of Object.entries(vehicleImageMap)) {
    if (key.includes('_')) {
      const [keyMake, keyModel] = key.split('_')
      if (make.includes(keyMake) && model.includes(keyModel)) {
        return url
      }
    }
  }

  const type = (vehicle.type || 'SEDAN').toUpperCase()
  return vehicleImageMap[type] || vehicleImageMap.SEDAN
}
