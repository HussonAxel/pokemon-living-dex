import * as React from 'react'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function SwitchCard() {
  const id = React.useId()

  return (
    <Label
      htmlFor={id}
      className="flex items-center gap-6 rounded-lg border p-3"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-4">Enable notifications</p>
        <p className="text-xs text-muted-foreground">
          You can enable or disable notifications at any time.
        </p>
      </div>
      <Switch id={id} defaultChecked />
    </Label>
  )
}
