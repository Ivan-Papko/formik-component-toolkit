import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

import { type IFormikTextFieldProps, FormikTextField } from '../FormikTextField'

export const FormikPasswordField = (props: IFormikTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClick = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <FormikTextField
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClick} edge="end">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
      type={showPassword ? 'text' : 'password'}
    />
  )
}

FormikPasswordField.displayName = 'PasswordField'
