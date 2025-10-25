import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch'
import { Moon, Sun } from 'lucide-react'

import { Link, useSearch } from '@tanstack/react-router'

export default function SwitchIcon() {
  const id = useId()
  const search = useSearch({ from: '__root__' }) as { showShiny?: boolean }
  const showShiny = search.showShiny || false
  const isOn = showShiny === true

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center space-x-2.5">
        <Link
          to="."
          search={(prev) => ({
            ...prev,
            showShiny: !showShiny,
          })}
        >
          {' '}
          <SwitchWrapper>
            <Switch id={id} size="xl" checked={isOn} />
            <SwitchIndicator state="on">
              <Sun className="size-4 text-primary-foreground" />
            </SwitchIndicator>
            <SwitchIndicator state="off">
              <Moon className="size-4 text-muted-foreground" />
            </SwitchIndicator>
          </SwitchWrapper>
          <Label htmlFor={id}>Icon Indicator</Label>
        </Link>
      </div>
    </div>
  )
}
