const STORAGE_PREFIX = 'app_report_'  // prefix key for clarity

export function setReportData(key, data) {
  try {
    console.log("SET NEW ")
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch (e) {
    console.error(`Failed to save ${key}:`, e)
  }
}

export function getReportData(key) {
  try {
    const jsonData = localStorage.getItem(STORAGE_PREFIX + key)
    return jsonData ? JSON.parse(jsonData) : null
  } catch (e) {
    console.error(`Failed to parse ${key}:`, e)
    return null
  }
}

export function updateReportData(key, updateFn) {
  try {
    const currentData = getReportData(key) || {}
    const updatedData = updateFn(currentData)
    setReportData(key, updatedData)
  } catch (e) {
    console.error(`Failed to update ${key}:`, e)
  }
}

export function clearReportData(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch (e) {
    console.error(`Failed to clear ${key}:`, e)
  }
}
