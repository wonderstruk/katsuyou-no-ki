import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import GameApp from './components/GameApp'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Shippori Mincho',serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>活用の木</div>
          <div style={{ fontSize: '0.85rem', color: '#494850', opacity: 0.55 }}>Loading...</div>
        </div>
      </div>
    )
  }

  return user ? <GameApp /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
