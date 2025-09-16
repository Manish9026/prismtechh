export async function delayImport<T>(p: Promise<T>, ms = 1000): Promise<T> {
  await new Promise(res => setTimeout(res, ms))
  return p
}


