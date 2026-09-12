export const getAPODImage = async () => {
  const response = await fetch(
    `https://science.nasa.gov/wp-json/wp/v2/apod-basic?page=1&per_page=1`,
  )
  const data = await response.json()

  return data[0]
}
