const DATABASE = 'gitcourse-drafts';
let opening: Promise<IDBDatabase> | undefined;
function openDatabase(): Promise<IDBDatabase> {
  if (!opening) opening = new Promise((resolve, reject) => {
    const open = indexedDB.open(DATABASE, 1);
    open.onupgradeneeded = () => { open.result.createObjectStore('records', { keyPath: 'key' }); };
    open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
  });
  return opening;
}
export async function writeRecord(key: string, value: unknown): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite'); tx.objectStore('records').put({ key, value });
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
  });
}
export async function readRecord<T>(key: string): Promise<T | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const req = db.transaction('records', 'readonly').objectStore('records').get(key);
    req.onsuccess = () => resolve((req.result as { value: T } | undefined)?.value); req.onerror = () => reject(req.error);
  });
}
export async function deleteRecord(key: string): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite'); tx.objectStore('records').delete(key); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  });
}
export async function listRecords<T>(prefix: string): Promise<{ key: string; value: T }[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const req = db.transaction('records', 'readonly').objectStore('records').getAll();
    req.onsuccess = () => resolve((req.result as { key: string; value: T }[]).filter((item) => item.key.startsWith(prefix))); req.onerror = () => reject(req.error);
  });
}
