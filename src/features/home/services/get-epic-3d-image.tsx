export async function getEPIC3DImage() {
  const response = await fetch('https://epic.gsfc.nasa.gov/api/enhanced/date/2015-10-31')
  const data = await response.json()

  return data
}
