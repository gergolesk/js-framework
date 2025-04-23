const mountCallbacks = [];

export function onMount(callback) {
  mountCallbacks.push(callback);
}

export async function runMountCallbacks() {
  for (const cb of mountCallbacks) {
    await cb();
  }
  mountCallbacks.length = 0; // Очищаем после выполнения
}
