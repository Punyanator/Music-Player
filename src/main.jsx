import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Musicplayer from './music-player.jsx'
import './music-player.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Musicplayer />
  </StrictMode>
)
