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
      <Form.Form
        onSubmit={() => {
          return
        }}
      >
        <Form.Wrapper>
          <Form.MultiSelect id="items" name="items" label="Items" options={['test1', 'test2']} />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

describe('MultiSelect', () => {
  it('should render a MultiSelect component', async () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should select/deselect items', async () => {
    const { setup, baseElement, screen } = factory()
    const user = setup()

    const items = screen.getByLabelText(/Items/i)
    await user.click(items)

    await user.click(screen.getByText(/test1/i))
    expect(baseElement).toMatchSnapshot() //test1 selected

    await user.click(screen.getByText(/test2/i))
    expect(baseElement).toMatchSnapshot() //all items selected

    await user.click(screen.getByText(/Select all/i))
    expect(baseElement).toMatchSnapshot() //no items selected

    await user.click(screen.getByText(/Select all/i))
    expect(baseElement).toMatchSnapshot() //all items selected
  })
})
