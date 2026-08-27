import { createManualLead } from "@/actions/desk"
import { areaOptions } from "@/lib/areas"

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl text-coral">Add a lead by hand</h1>
      <p className="mt-2 text-sm text-ink/60">FSBO, expired, sphere, referral — same scoring as a website lead.</p>
      {error ? <p className="mt-3 text-sm text-coral">Name is required.</p> : null}
      <form action={createManualLead} className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Type" name="type" options={[{ v: "seller", l: "Seller" }, { v: "buyer", l: "Buyer" }]} />
        <Field
          label="Source"
          name="source"
          options={[
            { v: "manual", l: "Manual" },
            { v: "fsbo", l: "FSBO" },
            { v: "expired", l: "Expired" },
            { v: "sphere", l: "Sphere" },
            { v: "referral", l: "Referral" },
          ]}
        />
        <Text label="Name" name="name" required />
        <Text label="Phone" name="phone" />
        <Text label="Email" name="email" />
        <Text label="Address" name="address" />
        <label className="grid gap-1.5 text-sm">
          Area
          <select name="areaSlug" className="h-10 border hairline bg-paper px-2 text-sm">
            {areaOptions.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Timeline"
          name="timeline"
          options={[
            { v: "asap", l: "Ready now" },
            { v: "30_days", l: "30 days" },
            { v: "90_days", l: "90 days" },
            { v: "6_months", l: "This year" },
            { v: "browsing", l: "Browsing" },
          ]}
        />
        <Text label="Price / budget" name="estimatedValue" />
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          Motivation
          <textarea name="motivation" className="min-h-20 border hairline bg-paper px-2 py-2 text-sm" />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-sm bg-coral px-5 py-2 text-sm font-medium text-paper">
            Score and open file
          </button>
        </div>
      </form>
    </div>
  )
}

function Text({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="grid gap-1.5 text-sm">
      {label}
      <input name={name} required={required} className="h-10 border hairline bg-paper px-2 text-sm" />
    </label>
  )
}

function Field({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: { v: string; l: string }[]
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      {label}
      <select name={name} className="h-10 border hairline bg-paper px-2 text-sm">
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  )
}
