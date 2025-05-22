import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'
import type { ICountry } from '../types'

describe('RegionField', () => {
  it('should render a RegionField component', async () => {
    const mockCountries = [
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
    ] as ICountry[]

    const { container } = render(
      <Form.Context<ICountry>
        initialValues={{} as ICountry}
        onSubmit={() => {
          return
        }}
      >
        <Form.Form>
          <Form.Wrapper>
            <Form.RegionField id="region" country="France" countries={mockCountries} />
          </Form.Wrapper>
        </Form.Form>
      </Form.Context>,
    )

    expect(container).toMatchSnapshot()
  })
})
