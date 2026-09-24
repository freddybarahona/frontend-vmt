export interface CorreoCodigoVerificacionRequest {
  email: string
  name: string
  identificacion: string
  password: string
  repeatPassword: string
  role: string
  subject?: string | null
  htmlContent?: string | null
}
