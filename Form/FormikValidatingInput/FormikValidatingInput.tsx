import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Check from '@mui/icons-material/Check'
import Error from '@mui/icons-material/Error'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import debounce from '@mui/material/utils/debounce'
import { useFormikContext } from 'formik'

import { FormikTextField } from '../FormikTextField'

/*
This is a special variation of the FormikTextField which is
capable of launching an async call to validate the contents of the input.

This input will show a green checkmark if the input is valid. If
it's invalid, it'll show a red error icon.

This is different from the schema validation supported by the
standard FormikTextField in that the schema validation is unable to validate
inputs based on a network call.
*/

/*
  In the calling component, you may want to be able to
  access three things:
  1.) The current validity of the input (true/false)
  2.) The value returned by the validation callback (any type).
  3.) The actual value in the input box (a string)

  To do this, pass a setState function from the parent component here. It
  will be called accordingly when the input is validated and after the
  callback function runs.
*/
export interface FormikValidationInputComponentState {
  isValid: boolean
  returnValue: any
  currentInputValue: string
}

export interface FormikValidationInputProps {
  /*
    This function can do whatever you need it to, but it needs to return
    false if the input is considered invalid. It can return anything else for
    valid inputs, and the return value will be passed into the successMessage callback.
    This is useful for showing the user helpful context in the messages.
  */
  validationCallback: (input: string) => Promise<any>
  onChange?: (input: string) => void
  label: string
  validationErrorMessage: string
  hintMessage: string
  successMessage: (valueReturnedFromValidationCallback: string) => string
  placeholderMessage: string
  componentStateSetter?: Dispatch<SetStateAction<FormikValidationInputComponentState>>

  formikId: string

  // Pass this to display something in the validation input. Whatever
  // you pass here will be validated when the component mounts. If this equals an empty
  // string, no validation will run and the placeholder message will appear.
  defaultValue?: string
}

/*
  A validation input is a text-based input, however it will launch
  a network call based on the contents and give visual feedback to the
  user as to whether or not the input is valid
*/
export const FormikValidatingInput = (props: FormikValidationInputProps) => {
  const [input, setInput] = useState(props.defaultValue ?? '')
  const [isValid, setIsValid] = useState(false)
  const [validating, setValidating] = useState(false)
  const { setFieldValue } = useFormikContext()

  const [validationError, setValidationError] = useState('')

  // This holds whatever is returned by your validation callback.
  const [promiseReturnValue, setPromiseReturnValue] = useState('')

  /**
   * Handle the display name updates as the user types it.
   */
  const onInputChanged = async ({ target }: ChangeEvent<any>) => {
    // Extract the value from the input field
    const value = target.value
    setInput(value)

    /* Now let's start validating the display name */

    // Invalidate the display name while validation is happening
    setIsValid(false)
    setValidationError('')

    // Start the validation state
    setValidating(true)

    if (props.onChange) {
      props.onChange(value)
    }

    setFieldValue(props.formikId, value)
    // Run the validation operation
    await doValidation(value)
  }

  const { validationCallback, validationErrorMessage, componentStateSetter } = props

  /**
   * Validates the display name, and updates the input field once validation is done
   *
   * @param {string} newDisplayName - The display name for the new org.
   * @param {string} newDomainName - The domain name for the new org.
   */
  const doValidation = useMemo(
    () =>
      debounce(async (valueToValidate: string) => {
        if (!validationCallback) {
          // With no callback, inputs are always valid
          setValidating(false)
          setValidationError('')
          setIsValid(true)
        } else {
          const isValid = await validationCallback?.(valueToValidate)
          setPromiseReturnValue(isValid)

          if (!isValid) {
            setValidating(false)
            setValidationError(validationErrorMessage)
            setIsValid(false)
            componentStateSetter?.({
              isValid: false,
              returnValue: isValid,
              currentInputValue: valueToValidate,
            })

            return
          }

          // Otherwise, it's valid.
          setValidating(false)
          setValidationError('')
          setIsValid(true)
          componentStateSetter?.({
            isValid: true,
            returnValue: isValid,
            currentInputValue: valueToValidate,
          })
        }
      }, 600),
    [componentStateSetter, validationCallback, validationErrorMessage],
  )

  useEffect(() => {
    if (props.defaultValue) {
      setInput(props.defaultValue)
      setValidating(true)
      doValidation(props.defaultValue)
    }
  }, [doValidation, props.defaultValue])

  // Determine the validation icon we'll add to the input box
  let validationIcon

  if (validating) {
    validationIcon = (
      <CircularProgress size={14} color="primary" data-testid="licenses-page-progress" />
    )
  } else if (validationError) {
    validationIcon = <Error color="error" />
  } else {
    validationIcon = <Check color="success" />
  }

  return (
    <>
      <FormikTextField
        id={props.formikId}
        value={input}
        data-testid="validation-input-contents"
        placeholder={props.placeholderMessage}
        onChange={onInputChanged}
        InputProps={{
          endAdornment: <InputAdornment position="end">{!!input && validationIcon}</InputAdornment>,
        }}
      ></FormikTextField>

      {
        // This ternary is a bit dense... here's what's going on:
        // If input is valid, show the success message.
        // Otherwise, show a hint message if there's no validation error.
        // Otherwise, there's a validation error that needs to be displayed.
      }

      {isValid ? (
        <small className="text-muted mb-3 form-text">
          {props.successMessage(promiseReturnValue)}
        </small>
      ) : !input || !validationError ? (
        <small className="text-muted mb-3 form-text">{props.hintMessage}</small>
      ) : (
        <small className="text-muted mb-3 form-text">{validationError}</small>
      )}
    </>
  )
}
