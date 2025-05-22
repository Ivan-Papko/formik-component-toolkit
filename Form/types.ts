export interface IRegion {
  name: string
  shortCode: string
}
export interface ICountry {
  countryName: string
  countryShortCode: string
  regions: IRegion[]
}
