import type { Dispatch, SetStateAction } from 'react'
import { waitFor } from '@testing-library/react'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

import type { FormikValidationInputComponentState } from './FormikValidatingInput'

interface FactoryProps {
  formikId: string
  validationCallback: jest.Mock<Promise<unknown>>
  label: string
  validationErrorMessage: string
  hintMessage: string
  successMessage: (message: string) => string
  placeholderMessage: string
  componentStateSetter?: Dispatch<SetStateAction<FormikValidationInputComponentState>>
  defaultValue?: string
  onChange?: (input: string) => void
}

jest.mock('@mui/material/utils/debounce', () => jest.fn(fn => fn))

const mockValidationCallback = jest.fn(input => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (input === 'valid') {
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
})

const defaultProps = {
  formikId: 'organizations',
  validationCallback: mockValidationCallback,
  label: 'Validating Input',
  validationErrorMessage: 'Invalid input',
  hintMessage: 'HintMessage',
  successMessage: (message: string) => message,
  placeholderMessage: 'Enter text',
}

const factory = ({
  formikId,
  validationCallback,
  label,
  validationErrorMessage,
  hintMessage,
  successMessage,
  placeholderMessage,
  ...props
}: FactoryProps) =>
  render(
    <Form.Context initialValues={{}} onSubmit={jest.fn()}>
      <Form.Form>
        <Form.Wrapper>
          <Form.ValidatingInput
            formikId={formikId}
            validationCallback={validationCallback}
            label={label}
            validationErrorMessage={validationErrorMessage}
            hintMessage={hintMessage}
            successMessage={successMessage}
            placeholderMessage={placeholderMessage}
            {...props}
          />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

const mockComponentStateSetter = jest.fn()

describe('FormikValidatingInput', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    mockValidationCallback.mockClear()
    mockComponentStateSetter.mockClear()
  })
  it('should render a ValidatingInput component', async () => {
    const { baseElement } = factory({ ...defaultProps, defaultValue: 'My Licence' })
    expect(baseElement).toMatchSnapshot()
  })

  it('should validate input after debounce period', async () => {
    const { screen, setup } = factory({
      ...defaultProps,
      componentStateSetter: mockComponentStateSetter,
    })

    const user = setup()

    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'invalid')

    jest.advanceTimersByTime(600)

    await waitFor(() => expect(mockValidationCallback).toHaveBeenCalledWith('invalid'))
    expect(mockComponentStateSetter).toHaveBeenCalledWith({
      isValid: false,
      returnValue: false,
      currentInputValue: 'invalid',
    })
  })

  it('should show success message for valid input', async () => {
    const { screen, setup } = factory({
      ...defaultProps,
      componentStateSetter: mockComponentStateSetter,
    })
    const user = setup()
    const input = screen.getByPlaceholderText('Enter text')

    await user.type(input, 'valid')

    jest.advanceTimersByTime(600)

    await waitFor(() => expect(mockValidationCallback).toHaveBeenCalledWith('valid'))

    expect(mockComponentStateSetter).toHaveBeenCalledWith({
      isValid: true,
      returnValue: true,
      currentInputValue: 'valid',
    })
  })
})
