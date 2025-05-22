import { SnackbarProvider } from 'notistack'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

describe('TextField', () => {
  it('should render a textfield component', () => {
    const { baseElement } = render(
      <Form.Context
        initialValues={{}}
        onSubmit={() => {
          return
        }}
      >
        <Form.Form>
          <Form.Wrapper>
            <Form.TextField
              id="email"
              label="Username / Email address"
              name="email"
              value="some@cloudbees.com"
              autoComplete="email"
            />
          </Form.Wrapper>
        </Form.Form>
      </Form.Context>,
      [SnackbarProvider],
    )
    expect(baseElement).toMatchSnapshot()
  })
})
