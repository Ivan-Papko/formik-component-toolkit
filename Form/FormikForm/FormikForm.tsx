import { Form, useFormikContext } from 'formik'

export interface IFormProps {
  children: React.ReactNode
  onSubmit?: () => void
}
export const FormikForm = ({ children }: IFormProps) => {
  const { handleSubmit } = useFormikContext()

  return (
    <Form
      onSubmit={e => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      {children}
      {/* <button style={{ display: 'none' }} disabled={!isValid || !dirty || isSubmitting}></button> */}
    </Form>
  )
}
