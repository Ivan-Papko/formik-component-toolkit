import { useField } from 'formik'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'
import type { ICountry } from '../types'

const mockCountries: ICountry[] = [
  {
    countryName: 'France',
    countryShortCode: 'FR',
    regions: [
      {
        name: 'Auvergne-Rhône-Alpes',
        shortCode: 'ARA',
      },
      {
        name: 'Bourgogne-Franche-Comté',
        shortCode: 'BFC',
      },
    ],
  },
  {
    countryName: 'Germany',
    countryShortCode: 'DE',
    regions: [
      {
        name: 'Bavaria',
        shortCode: 'BY',
      },
      {
        name: 'Berlin',
        shortCode: 'BE',
      },
    ],
  },
]

jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useField: jest.fn(),
}))

const factory = (countries?: ICountry[]) =>
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
          <Form.CountryField id="country" countries={countries} />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

describe('CountryField', () => {
  beforeEach(() => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: '', onBlur: jest.fn(), onChange: jest.fn() },
      { touched: false, error: '' },
      { setValue: jest.fn(), setTouched: jest.fn() },
    ])
  })
  it('should render a CountryField component', () => {
    const { baseElement } = factory(mockCountries)
    expect(baseElement).toMatchSnapshot()
  })

  it('should render default country options if no countries are provided', () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should update field value when a country is selected', async () => {
    const { setup, screen } = factory()
    const user = setup()

    const autocomplete = screen.getByRole('combobox')
    await user.click(autocomplete)

    const germanyOption = screen.getByText('Germany')
    await user.click(germanyOption)

    expect(autocomplete).toHaveValue('Germany')
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
})
