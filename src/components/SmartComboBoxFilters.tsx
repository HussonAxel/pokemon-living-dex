import * as React from 'react'
import { SmartCombobox } from '@/components/ui/smart-combo-box'

type DemoOption = {
  id: string
  label: string
  group?: string
  meta?: string
}

const frameworks: DemoOption[] = [
  { id: 'react', label: 'React', group: 'Frontend', meta: 'Library' },
  { id: 'vue', label: 'Vue', group: 'Frontend', meta: 'Framework' },
  { id: 'svelte', label: 'Svelte', group: 'Frontend', meta: 'Compiler' },
  { id: 'solid', label: 'Solid', group: 'Frontend', meta: 'Signals' },
]

export default function SmartComboboxFilters() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <div>
      <SmartCombobox
        placeholder="Search frameworks…"
        options={frameworks}
        multiple
        value={value}
        onValueChange={(v) => setValue(Array.isArray(v) ? v : [])}
        header={<span>Popular frameworks</span>}
        footer={<span>Tip: Type to filter, Enter to select.</span>}
        emptyState={<span>No matches. Try a different keyword.</span>}
        className="w-full"
      />
    </div>
  )
}
