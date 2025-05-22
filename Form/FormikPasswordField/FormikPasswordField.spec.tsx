import { SnackbarProvider } from 'notistack'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

const factory = () =>
  render(
    <Form.Context
      initialValues={{}}
      onSubmit={() => {
        return
      }}
    >
      <Form.Form>
        <Form.Wrapper>
          <Form.PasswordField id="password" label="Password" name="password" />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
    [SnackbarProvider],
  )

describe('PasswordField', () => {
  it('should render a password field component', () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should toggle password visibility when the icon button is clicked', async () => {
    const { setup, screen } = factory()
    const user = setup()

    const input = screen.getByTestId('password-input')

    // Click icon to toggle visibility
    const iconButton = screen.getByRole('button')
    await user.click(iconButton)

    expect(input).toHaveAttribute('type', 'text')

    // Click icon again to hide password
    await user.click(iconButton)
    expect(input).toHaveAttribute('type', 'password')
  })
})
