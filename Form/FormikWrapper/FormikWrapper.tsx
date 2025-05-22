import Box from '@mui/material/Box'

import type { IFormWrapperProps } from './types'

export const FormikWrapper = ({ children }: IFormWrapperProps) => {
  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {children}
    </Box>
  )
}

FormikWrapper.displayName = 'FormWrapper'
