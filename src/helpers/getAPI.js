export const getAPI = async (ciudad) => {
  const apiKey = 'a08c79c958e60fe43b22b6df7bc45330'
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${apiKey}&lang=es&units=metric`

  const resp = await fetch(url)

  const { city, list } = await resp.json()

  const cityList = {
    name: city.name,
    country: city.country,
    info: [],
  }

  for (let i = 0; i < 5; i++) {
    const dayData = list[i * 8]

    if (dayData) {
      cityList.info.push({
        temp: dayData.main.temp,
        visual: dayData.weather[0].description,
        humidity: dayData.main.humidity,
        precipitation: dayData.rain ? dayData.rain['3h'] : 0,
        wind: dayData.wind.speed,
        sensation: dayData.main.feels_like,
        icon: dayData.weather[0].icon,
      })
    }
  }

  return {
    cityList,
  }
}
