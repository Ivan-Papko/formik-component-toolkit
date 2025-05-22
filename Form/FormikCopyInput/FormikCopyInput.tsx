import { type FC, useRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment'

import { CopyButton } from '@cloudbees/shared-components/CopyButton'
import { copyTextToClipboard } from '@cloudbees/shared-utils/copyTextToClipboard'

import { Form } from '../Form'
import type { IFormikTextFieldProps } from '../FormikTextField'

export interface IFormikCopyInputProps extends IFormikTextFieldProps {
  onSuccessCallback?: () => void
}

export const FormikCopyInput: FC<IFormikCopyInputProps> = ({
  value,
  onSuccessCallback,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onCopyButtonClick = async () => {
    if (inputRef.current?.value) {
      await copyTextToClipboard(inputRef.current?.value)
      onSuccessCallback?.()
    }
  }

  return (
    <Form.TextFieldWithRef
      {...props}
      ref={inputRef}
      value={value}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: '0px',
        },
      }}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="start">
            <CopyButton onClick={async () => await onCopyButtonClick()} />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default FormikCopyInput
