import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Container, Row, Col, Button, Card, ListGroup, Spinner } from 'react-bootstrap'
import { FaFolderOpen, FaArrowLeft, FaUserCircle, FaCalendarAlt, FaEnvelope, FaPhone, FaGoogleDrive, FaGoogle } from 'react-icons/fa'
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loadingUserInfo, setLoadingUserInfo] = useState(false)
  const [contacts, setContacts] = useState<any>(null)
  const [calendarEvents, setCalendarEvents] = useState<any>(null)
  const [driveFiles, setDriveFiles] = useState<any>(null)
  const [gmailMessages, setGmailMessages] = useState<any>(null)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingCalendar, setLoadingCalendar] = useState(false)
  const [loadingDrive, setLoadingDrive] = useState(false)
  const [loadingGmail, setLoadingGmail] = useState(false)

  const exchangeCodeForTokens = async (code: string) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5173',
        grant_type: 'authorization_code',
      }),
    })
    const data = await response.json()
    return data
  }

  const fetchUserInfo = async (accessToken: string) => {
    setLoadingUserInfo(true)
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    } finally {
      setLoadingUserInfo(false)
    }
  }

  const fetchContacts = async (accessToken: string) => {
    setLoadingContacts(true)
    try {
      const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers&pageSize=5', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      console.log('Contacts Data:', data)
      setContacts(data.connections || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoadingContacts(false)
    }
  }

  const fetchCalendarEvents = async (accessToken: string) => {
    setLoadingCalendar(true)
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&singleEvents=true&orderBy=startTime', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      setCalendarEvents(data.items || [])
    } catch (error) {
      console.error('Error fetching calendar events:', error)
    } finally {
      setLoadingCalendar(false)
    }
  }

  const fetchDriveFiles = async (accessToken: string) => {
    setLoadingDrive(true)
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType)', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      setDriveFiles(data.files || [])
    } catch (error) {
      console.error('Error fetching drive files:', error)
    } finally {
      setLoadingDrive(false)
    }
  }

  const fetchGmailMessages = async (accessToken: string) => {
    setLoadingGmail(true)
    try {
      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      setGmailMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching gmail messages:', error)
    } finally {
      setLoadingGmail(false)
    }
  }

  const resetLogin = () => {
    setUser(null)
    setUserInfo(null)
    setContacts(null)
    setCalendarEvents(null)
    setDriveFiles(null)
    setGmailMessages(null)
  }

  const loginBasic = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoadingAuth(true)
        console.log('Login Success:', tokenResponse)
        const tokens = await exchangeCodeForTokens(tokenResponse.code)
        setUser(tokens)
        await fetchUserInfo(tokens.access_token)
      } finally {
        setLoadingAuth(false)
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error)
      alert('Error en login: ' + JSON.stringify(error))
    },
    scope: 'openid profile email',
    flow: 'auth-code'
  })

  const loginSensitive = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoadingAuth(true)
        console.log('Login Success:', tokenResponse)
        const tokens = await exchangeCodeForTokens(tokenResponse.code)
        setUser(tokens)
        await fetchUserInfo(tokens.access_token)
        await fetchContacts(tokens.access_token)
        await fetchCalendarEvents(tokens.access_token)
      } finally {
        setLoadingAuth(false)
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error)
      alert('Error en login: ' + JSON.stringify(error))
    },
    scope: 'openid profile email https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/calendar.readonly',
    flow: 'auth-code'
  })

  const loginRestricted = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoadingAuth(true)
        console.log('Login Success:', tokenResponse)
        const tokens = await exchangeCodeForTokens(tokenResponse.code)
        setUser(tokens)
        await fetchUserInfo(tokens.access_token)
        await fetchDriveFiles(tokens.access_token)
        await fetchGmailMessages(tokens.access_token)
      } finally {
        setLoadingAuth(false)
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error)
      alert('Error en login: ' + JSON.stringify(error))
    },
    scope: 'openid profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/gmail.readonly',
    flow: 'auth-code'
  })

  return (
    <Container className="App" fluid style={{ padding: '2rem' }}>
      <h1 className="text-center mb-4">PoC OAuth 2.0 con Google</h1>
      {!user ? (
        <div className="login-section d-flex gap-3 justify-content-center flex-wrap mx-auto">
          <Button disabled={loadingAuth} className="btn-google-blue btn-lg" onClick={() => loginBasic()}>
            <FaGoogle className="me-2" /> Login con Scopes No Sensibles (Profile, Email)
          </Button>
          <Button disabled={loadingAuth} className="btn-google-green btn-lg" onClick={() => loginSensitive()}>
            <FaPhone className="me-2" /> Login con Scopes Sensibles (Números de Contactos, Calendar Readonly)
          </Button>
          <Button disabled={loadingAuth} className="btn-google-red btn-lg" onClick={() => loginRestricted()}>
            <FaGoogleDrive className="me-2" /> Login con Scopes Restringidos (Drive Full, Gmail Readonly) - Requiere Verificación
          </Button>
        </div>
      ) : (
        <div className="success-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Login Exitoso!</h2>
            <Button variant="outline-secondary" onClick={resetLogin}>
              <FaArrowLeft className="me-2" /> Probar Otro Scope
            </Button>
          </div>
          <Row className="g-3">
            <Col md={6} lg={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Tokens y Scopes</Card.Title>
                  <p><strong>Access Token:</strong> {user.access_token.substring(0, 50)}...</p>
                  <p><strong>Refresh Token:</strong> {user.refresh_token ? user.refresh_token.substring(0, 50) + '...' : 'No disponible (solo en el primer login)'}</p>
                  <p><strong>Scope:</strong> {user.scope}</p>
                  <p className="text-muted"><em>Consentimiento Offline: Con el refresh token, puedes renovar el access token sin interacción del usuario, permitiendo acceso continuo a las APIs de Google.</em></p>
                </Card.Body>
              </Card>
            </Col>
          {loadingUserInfo && (
            <Col md={6} lg={4}>
              <Card>
                <Card.Body className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Cargando información del usuario...</p>
                </Card.Body>
              </Card>
            </Col>
          )}

          {userInfo && (
            <Col md={6} lg={4}>
              <Card>
                <Card.Body>
                  <Card.Title><FaUserCircle className="me-2" />Información del Usuario</Card.Title>
                  <p><strong>Nombre:</strong> {userInfo.name}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>ID:</strong> {userInfo.id}</p>
                </Card.Body>
              </Card>
            </Col>
          )}
          {loadingContacts ? (
            <Col md={6} lg={4}>
              <Card>
                <Card.Body className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Cargando contactos...</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            contacts && contacts.length > 0 && (
              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaPhone className="me-2" />Números de Teléfono de Contactos (Scopes Sensibles)</Card.Title>
                    <ListGroup variant="flush">
                      {contacts.map((contact: any, index: number) => (
                        <ListGroup.Item key={index}>
                          {contact.phoneNumbers?.[0]?.value || 'Sin número'}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
          {loadingCalendar ? (
            <Col md={6} lg={4}>
              <Card>
                <Card.Body className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Cargando calendario...</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            calendarEvents && calendarEvents.length > 0 && (
              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaCalendarAlt className="me-2" />Eventos del Calendario (Scopes Sensibles)</Card.Title>
                    <ListGroup variant="flush">
                      {calendarEvents.slice(0, 5).map((event: any, index: number) => (
                        <ListGroup.Item key={index}>
                          {event.summary} - {new Date(event.start?.dateTime || event.start?.date).toLocaleDateString()}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
          {loadingDrive ? (
            <Col md={6} lg={4}>
              <Card>
                <Card.Body className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Cargando Drive...</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            driveFiles && driveFiles.length > 0 && (
              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaFolderOpen className="me-2" />Archivos de Drive (Scopes Restringidos)</Card.Title>
                    <ListGroup variant="flush">
                      {driveFiles.slice(0, 5).map((file: any, index: number) => (
                        <ListGroup.Item key={index}>
                          {file.name} ({file.mimeType})
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
          {loadingGmail ? (
            <Col md={6} lg={4}>
              <Card>
                <Card.Body className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Cargando Gmail...</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            gmailMessages && gmailMessages.length > 0 && (
              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaEnvelope className="me-2" />Mensajes de Gmail (Scopes Restringidos)</Card.Title>
                    <p><strong>IDs de mensajes recientes:</strong> {gmailMessages.slice(0, 5).map((msg: any) => msg.id).join(', ')}</p>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>
        </div>
      )}
    </Container>
  )
}

export default App
