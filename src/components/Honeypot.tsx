import { HONEYPOT_FIELD } from "@/lib/leads";

// Off-screen field. Real visitors never see it. Bots that fill every input
// get a quiet success response and no email is sent.
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Fax
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
