import SmartComboboxFilters from './SmartComboBoxFilters'
import SwitchIcon from '@/components/switchIcon'

export const Filters = () => {
  return (
    <div className="sticky top-[56px]">
      <div className="flex flex-row z-10 mx-16 py-8 justify-between">
        <SmartComboboxFilters />
        <SmartComboboxFilters />
        <SmartComboboxFilters />
        <SmartComboboxFilters />
        <SmartComboboxFilters />
        <SwitchIcon />
      </div>
    </div>
  )
}
