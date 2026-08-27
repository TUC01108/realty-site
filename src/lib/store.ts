import { promises as fs } from "node:fs"
import path from "node:path"
import { createSeedStore } from "./seed"
import type { Store } from "./types"

function dataDir() {
  if (process.env.YBI_DATA_DIR) return process.env.YBI_DATA_DIR
  if (process.env.VERCEL) return "/tmp/ybi-desk"
  return path.join(process.cwd(), "data")
}

function storePath() {
  return path.join(dataDir(), "store.json")
}

let queue: Promise<void> = Promise.resolve()

async function ensureDir() {
  await fs.mkdir(dataDir(), { recursive: true })
}

async function readRaw(): Promise<Store> {
  await ensureDir()
  try {
    const raw = await fs.readFile(storePath(), "utf8")
    const parsed = JSON.parse(raw) as Store
    if (!parsed.leads || !parsed.settings) throw new Error("bad store")
    return parsed
  } catch {
    const seeded = createSeedStore()
    await fs.writeFile(storePath(), JSON.stringify(seeded, null, 2))
    return seeded
  }
}

export async function getStore(): Promise<Store> {
  return readRaw()
}

export async function updateStore(mutator: (store: Store) => Store | void): Promise<Store> {
  let result: Store | undefined
  queue = queue.then(async () => {
    const current = await readRaw()
    const next = mutator(current) ?? current
    next.leads.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    await fs.writeFile(storePath(), JSON.stringify(next, null, 2))
    result = next
  })
  await queue
  if (!result) result = await readRaw()
  return result
}

export async function resetStore() {
  const seeded = createSeedStore()
  await ensureDir()
  await fs.writeFile(storePath(), JSON.stringify(seeded, null, 2))
  return seeded
}
