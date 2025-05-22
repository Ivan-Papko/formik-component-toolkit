import { useField } from 'formik'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'
const dropdownItems = ['item1', 'item2', 'item3']

interface FactoryProps {
  id?: string
  isSmall?: boolean
  populateOnInitialLoad?: boolean
  customRenderFn?: (value: string) => string
  disabledItems?: string[]
  onChange?: () => void
  helperText?: string
  placeholder?: string
}

const factory = (props: FactoryProps = {}) =>
  render(
    <Form.Context initialValues={{}} onSubmit={jest.fn()}>
      <Form.Form>
        <Form.Wrapper>
          <Form.Select dropdownItems={dropdownItems} {...props} />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

// Mock the useField hook from Formik
jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useField: jest.fn(),
}))

describe('FormikSelect', () => {
  beforeEach(() => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: '', onBlur: jest.fn(), onChange: jest.fn() },
      { touched: false, error: '' },
      { setValue: jest.fn(), setTouched: jest.fn() },
    ])
  })
  it('should render a Select component', async () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should render the placeholder', () => {
    const { screen } = factory({ id: 'items', placeholder: 'Select an item' })
    expect(screen.getByTestId('select-items')).toHaveTextContent('Select an item')
  })

  it('should populate value on initial load if specified', () => {
    const { screen } = factory({
      id: 'items',
      placeholder: 'Select an item',
      populateOnInitialLoad: true,
      isSmall: true,
    })
    expect(screen.getByTestId('select-items')).toHaveTextContent('Select an item')
  })

  it('should render dropdown items', async () => {
    const { screen, setup } = factory()
    const user = setup()
    await user.click(screen.getByRole('combobox'))
    dropdownItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('should use custom render function for dropdown items', async () => {
    const { screen, setup } = factory({ customRenderFn: value => `Custom ${value}` })
    const user = setup()

    await user.click(screen.getByRole('combobox'))
    dropdownItems.forEach(item => {
      expect(screen.getByText(`Custom ${item}`)).toBeInTheDocument()
    })
  })

  it('should disable specified items', async () => {
    const { screen, setup } = factory({ disabledItems: ['item2'] })
    const user = setup()
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByTestId('dropdown-item-item2')).toHaveAttribute('aria-disabled', 'true')
  })

  it('should handle changes', async () => {
    const handleChange = jest.fn()
    const { screen, setup } = factory({ onChange: handleChange })
    const user = setup()
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('item2'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("shouldn't handle changes with empty onChange handler", async () => {
    const { screen, setup } = factory({ id: 'items', placeholder: 'Select an item' })
    const user = setup()
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByTestId('dropdown-item-item2'))
    expect(screen.getByTestId('select-items')).toHaveTextContent('Select an item')
  })

  it('should show error message when there is an error', () => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: '', onBlur: jest.fn(), onChange: jest.fn() },
      { touched: true, error: 'Error message' },
      { setValue: jest.fn(), setTouched: jest.fn() },
    ])
    const { screen } = factory()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should show helper text', () => {
    const { screen } = factory({ helperText: 'Helper text' })
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })
})
