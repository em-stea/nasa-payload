/**
 * La URL `/live` de un canal de YouTube no es una API: es la misma página del
 * canal, que YouTube redirige (vía `<link rel="canonical">`) al video que esté
 * transmitiendo en ese momento. Sirve para chequear el estado sin necesitar
 * una API key.
 */
export const NASA_YOUTUBE_LIVE_URL = 'https://www.youtube.com/@NASA/live'
