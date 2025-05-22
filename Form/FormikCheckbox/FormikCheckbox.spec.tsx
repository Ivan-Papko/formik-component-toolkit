import { useField } from 'formik'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

// Mock the useField hook from Formik
jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useField: jest.fn(),
}))

const factory = (onChange?: () => void) =>
  render(
    <Form.Context
      initialValues={{}}
      onSubmit={() => {
        return
      }}
    >
      <Form.Form>
        <Form.Wrapper>
          <Form.Checkbox name="name" label="some label" onChange={onChange} />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

describe('Checkbox', () => {
  beforeEach(() => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { onChange: jest.fn() },
      { touched: false, error: null },
    ])
  })
  it('should render a checkbox component', () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should display the correct label', () => {
    const { screen } = factory()
    expect(screen.getByLabelText('some label')).toBeInTheDocument()
  })

  it('should toggle checkbox state on click', async () => {
    const { setup, screen } = factory()
    const user = setup()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('should call onChange handler when checkbox is clicked', async () => {
    const handleChange = jest.fn()
    const { screen, setup } = factory(handleChange)
    const user = setup()

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should not be crashed in onChangeHandler is not passed', async () => {
    const { setup, screen } = factory()
    const user = setup()

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
  })

  it('should show error message when there is an error', () => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { onChange: jest.fn() },
      { touched: true, error: 'Error message' },
    ])
    const { screen } = factory()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
