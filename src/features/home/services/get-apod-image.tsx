export const getAPODImage = async () => {
  const response = await fetch(`https://science.nasa.gov/wp-json/wp/v2/apod-basic`)
  const data = await response.json()

  return data[0]
}
