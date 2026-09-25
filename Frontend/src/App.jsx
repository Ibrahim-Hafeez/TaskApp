import { Routes, Route, Navigate } from 'react-router-dom'
import FeedbackPage from '@/pages/feedback/FeedbackPage'
import TaskPage from '@/pages/tasks/TaskPage'
import LoginPage from '@/pages/login/LoginPage'
import SignupPage from '@/pages/signup/SignupPage'
import ForgotPasswordPage from '@/pages/login/ForgotPasswordPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/feedback' element={<FeedbackPage />} />
      <Route path='/tasks' element={<TaskPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='forgot-password' element={<ForgotPasswordPage />} />
    </Routes>
  )
}

export default App;