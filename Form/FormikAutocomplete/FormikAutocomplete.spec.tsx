import { useField } from 'formik'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'
const options = ['item1', 'item2', 'item3']

interface FactoryProps {
  label?: string
  helperText?: string
  required?: boolean
  onChange?: () => void
  id?: string
}

const factory = (props: FactoryProps = {}) =>
  render(
    <Form.Context initialValues={{}} onSubmit={jest.fn()}>
      <Form.Form>
        <Form.Wrapper>
          <Form.Autocomplete id="items" options={options} {...props} />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

// Mock the useField hook from Formik
jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useField: jest.fn(),
}))

describe('FormikAutocomplete', () => {
  beforeEach(() => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: '' },
      { touched: false, error: '' },
      { setValue: jest.fn(), setTouched: jest.fn() },
    ])
  })

  it('should render a component', () => {
    const { baseElement } = factory({ id: 'autocomplete', required: false })
    expect(baseElement).toMatchSnapshot()
  })

  it('renders with custom label', () => {
    const { screen } = factory({ label: 'Custom Label' })
    expect(screen.getByLabelText(/custom label/i)).toBeInTheDocument()
  })
  it('shows helper text', () => {
    const { screen } = factory({ helperText: 'Helper Text' })
    expect(screen.getByText(/helper text/i)).toBeInTheDocument()
  })

  it('should show error message when there is an error', () => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: '' },
      { touched: true, error: 'Error message' },
      { setValue: jest.fn(), setTouched: jest.fn() },
    ])
    const { screen } = factory()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should handle changes', async () => {
    const handleChange = jest.fn()
    const { screen, setup } = factory({ onChange: handleChange })
    const user = setup()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('item2'))
    expect(handleChange).toHaveBeenCalled()
  })

  it('should handle changes using default handler', async () => {
    const setValue = jest.fn()
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: '' },
      { touched: false, error: '' },
      { setValue, setTouched: jest.fn() },
    ])
    const { setup, screen } = factory()
    const user = setup()
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('item2'))
    expect(setValue).toHaveBeenCalledWith('item2')
  })
})
