import { useState } from 'react'
import { getAPI } from '../helpers/getAPI.js'
import { weatherIconMap } from '../helpers/weatherIcons.js'
import { useForm } from '../hooks/useForm.jsx'

export const WeatherContainer = () => {
  const { searchText, onInputChange, onResetForm } = useForm({
    searchText: '',
  })

  const [cityInfo, setCityInfo] = useState({
    name: '',
    country: '',
    info: [],
  })

  const handleAPI = async (ciudad) => {
    const { cityList } = await getAPI(ciudad)
    setCityInfo(cityList)
  }

  const handleSearchSubmit = async (event) => {
    event.preventDefault()

    if (searchText.trim().length <= 1) return

    await handleAPI(searchText)

    onResetForm()
  }

  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ]
    return daysOfWeek[date.getDay()]
  }

  const getFormattedDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('es-ES', options)
  }

  const dayAbbreviations = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const getNextDayDate = (daysAhead) => {
    const today = new Date()
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + daysAhead)
    return nextDay
  }

  return (
    <>
      <form className='form-city' onSubmit={handleSearchSubmit}>
        <input
          className='input-city'
          type='text'
          placeholder='Buscar ciudad'
          value={searchText}
          name='searchText'
          onChange={onInputChange}
        />
        <div className='btn-container'>
          <button className='loc-button'>Buscar</button>
        </div>
      </form>
      <div className='container'>
        <div className='left-info'>
          <div className='pic-gradient'></div>
          <div className='today-info'>
            <h2>{getDayOfWeek(new Date())}</h2>
            <span>{getFormattedDate(new Date())}</span>

            <div className='current-time'>
              <i className='bx bx-time'></i>
              <span>
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            <div className='current-city'>
              {cityInfo.name && (
                <>
                  <i className='bx bx-current-location'> </i>
                  <span>
                    {cityInfo.name}, {cityInfo.country}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className='today-weather'>
            {cityInfo.name && (
              <i
                className={`bx bx-${weatherIconMap[cityInfo.info[0].icon]}`}
              ></i>
            )}

            <h1 className='weather-temp'>
              {cityInfo.name
                ? `${Math.round(cityInfo.info[0].temp)}°C`
                : '- °C'}
            </h1>
            <h3>
              {cityInfo.name
                ? cityInfo.info[0].visual.charAt(0).toUpperCase() +
                  cityInfo.info[0].visual.slice(1)
                : '-'}
            </h3>
          </div>
        </div>

        <div className='right-info'>
          <div className='day-info'>
            <div>
              <span className='title'>Sensacion Termica</span>
              <span className='value'>
                {cityInfo.name
                  ? `${Math.round(cityInfo.info[0].sensation)} °C`
                  : '-'}
              </span>
            </div>
            <div>
              <span className='title'>Precipitacion</span>
              <span className='value'>
                {cityInfo.name
                  ? `${Math.round(cityInfo.info[0].precipitation)} %`
                  : '-'}
              </span>
            </div>
            <div>
              <span className='title'>Humedad</span>
              <span className='value'>
                {cityInfo.name ? `${cityInfo.info[0].humidity} %` : '-'}
              </span>
            </div>
            <div>
              <span className='title'>Velocidad Viento</span>
              <span className='value'>
                {cityInfo.name
                  ? `${(cityInfo.info[0].wind * 3.6).toFixed(1)} km/h`
                  : '-'}
              </span>
            </div>
          </div>
          <ul className='days-list'>
            {[1, 2, 3, 4].map((value, index) => (
              <li key={index}>
                {cityInfo.name ? (
                  <i
                    className={`bx bx-${
                      weatherIconMap[cityInfo.info[value].icon]
                    }`}
                  />
                ) : (
                  <i className='bx bx-dots-horizontal-rounded'></i>
                )}
                <span>{dayAbbreviations[getNextDayDate(value).getDay()]}</span>
                <span className='day-temp'>
                  {cityInfo.name
                    ? `${Math.round(cityInfo.info[value].temp)}°C`
                    : '- °C'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
