import { restoreSamples, saveSettings } from "@/actions/desk"
import { getStore } from "@/lib/store"

export default async function SettingsPage() {
  const { settings } = await getStore()
  return (
    <div className="mx-auto grid max-w-xl gap-10">
      <div>
        <h1 className="font-display text-3xl text-coral">Desk settings</h1>
        <p className="mt-2 text-sm text-ink/60">This name prints on packets and emails.</p>
      </div>
      <form action={saveSettings} className="grid gap-4">
        <Text name="agentName" label="Agent name" defaultValue={settings.agentName} />
        <Text name="brokerage" label="Brokerage" defaultValue={settings.brokerage} />
        <Text name="license" label="License #" defaultValue={settings.license} />
        <Text name="phone" label="Phone" defaultValue={settings.phone} />
        <Text name="email" label="Email" defaultValue={settings.email} />
        <Text name="defaultCommissionRate" label="Default side commission (decimal)" defaultValue={String(settings.defaultCommissionRate)} />
        <label className="grid gap-1.5 text-sm">
          Cursor plan we are covering
          <select name="cursorPlan" defaultValue={settings.cursorPlan} className="h-10 border hairline bg-paper px-2">
            <option value="pro">Pro · $20/mo</option>
            <option value="ultra">Ultra · $200/mo</option>
          </select>
        </label>
        <button type="submit" className="rounded-sm bg-coral px-4 py-2 text-sm text-paper">
          Save settings
        </button>
      </form>
      <form action={restoreSamples} className="rounded-sm border border-dashed border-line p-4">
        <p className="text-sm font-medium">Reset sample pipeline</p>
        <p className="mt-1 text-sm text-ink/60">Do not run this after real clients are in here.</p>
        <button type="submit" className="mt-3 rounded-sm border hairline px-4 py-2 text-sm">
          Restore samples
        </button>
      </form>
    </div>
  )
}

function Text({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      {label}
      <input name={name} defaultValue={defaultValue} className="h-10 border hairline bg-paper px-2" />
    </label>
  )
}
