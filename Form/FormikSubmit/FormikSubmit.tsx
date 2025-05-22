import Button, { type ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useFormikContext } from 'formik'

export interface IFormikSubmitProps extends ButtonProps {
  dirty?: boolean
  onClick?: () => void
}

export const FormikSubmit = ({
  dirty: propDirty,
  onClick,
  children,
  ...buttonProps
}: IFormikSubmitProps) => {
  const { dirty, isValid, isSubmitting, handleSubmit } = useFormikContext()

  const clean = !propDirty && !dirty

  return (
    <Button
      variant="contained"
      {...buttonProps}
      type="submit"
      disabled={buttonProps.disabled || clean || !isValid || isSubmitting}
      onClick={() => {
        onClick?.()
        handleSubmit()
      }}
    >
      {isSubmitting ? <CircularProgress color="inherit" size={24} /> : children}
    </Button>
  )
}

FormikSubmit.displayName = 'Submit'
