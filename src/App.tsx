import { useSim } from './state'
import Home from './components/Home'
import SimScreen from './components/SimScreen'

export default function App() {
  const { state } = useSim()
  return state.view === 'sim' && state.sim ? <SimScreen sim={state.sim} /> : <Home />
}
