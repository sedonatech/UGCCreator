import { useMemo } from 'react';
import countryStates from '../consts/countriesStates.json';

export default (country?: string) => {
    const countries = useMemo(()=> countryStates?.data?.map((item)=> item?.country ) ,[countryStates])
    const cities = useMemo(()=> !!country ? countryStates?.data.find((c) => c.country === country)?.cities : null ,[country])
    const flag = useMemo(()=> !!country ? countryStates?.data.find((c) => c.country === country)?.flag : null ,[country])

    return {
        countries,
        cities,
        flag
    }
}