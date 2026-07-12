/**
 * medicationDailyReset.js
 *
 * Client-side daily reset utility for medication taken status.
 *
 * Problem: The backend stores `taken` as a simple boolean with no date context,
 * so once a dose is marked taken it stays taken forever.
 *
 * Solution: We maintain a local AsyncStorage snapshot keyed by today's date.
 * Structure stored:
 *   AsyncStorage key: "med_daily_status"
 *   Value (JSON):
 *   {
 *     "2026-06-13": {
 *       "prescriptionId_medIndex": true | false,
 *       ...
 *     }
 *   }
 *
 * Any entry whose date key != today is ignored (effectively resets to false).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'med_daily_status';

/** Returns today's date as "YYYY-MM-DD" */
export const getTodayDateStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/** Builds the composite key used inside today's entry */
const buildKey = (prescriptionId, medIndex) => `${prescriptionId}_${medIndex}`;

/**
 * Load today's local status map.
 * Returns an object: { "prescriptionId_medIndex": true|false, ... }
 * Returns {} if nothing stored for today (i.e. fresh day = all untaken).
 */
export const loadTodayStatus = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const all = JSON.parse(raw);
    const today = getTodayDateStr();
    // Only return today's entries — anything else is stale
    return all[today] || {};
  } catch (e) {
    console.warn('[MedDaily] Failed to load daily status:', e);
    return {};
  }
};

/**
 * Save a single medication's taken status for today.
 * @param {string} prescriptionId
 * @param {number} medIndex
 * @param {boolean} taken
 */
export const saveTodayStatus = async (prescriptionId, medIndex, taken) => {
  try {
    const today = getTodayDateStr();
    const raw   = await AsyncStorage.getItem(STORAGE_KEY);
    const all   = raw ? JSON.parse(raw) : {};

    // Prune old dates to prevent storage bloat (keep only last 7 days)
    const pruned = {};
    Object.keys(all).forEach(dateKey => {
      const diff = (new Date(today) - new Date(dateKey)) / (1000 * 60 * 60 * 24);
      if (diff < 7) pruned[dateKey] = all[dateKey];
    });

    if (!pruned[today]) pruned[today] = {};
    pruned[today][buildKey(prescriptionId, medIndex)] = taken;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch (e) {
    console.warn('[MedDaily] Failed to save daily status:', e);
  }
};

/**
 * Merges backend prescription data with today's local status.
 *
 * For each medication:
 *   - If the local daily cache has an entry → use that value (overrides backend)
 *   - If no local entry → default to false (new day = untaken)
 *
 * @param {Array} prescriptions  Raw prescriptions from backend/mock
 * @param {Object} todayStatus   Result of loadTodayStatus()
 * @returns {Array} Prescriptions with `taken` reflecting today's actual status
 */
export const applyDailyReset = (prescriptions, todayStatus) => {
  return prescriptions.map(rx => {
    const rxId = rx._id || rx.id;
    const key  = rx.medicines ? 'medicines' : 'medications';
    const meds = rx[key] || [];

    const updatedMeds = meds.map((med, idx) => {
      const localKey = buildKey(rxId, idx);
      if (Object.prototype.hasOwnProperty.call(todayStatus, localKey)) {
        // Local cache has an entry for today → trust it
        return { ...med, taken: todayStatus[localKey] };
      }
      // No local entry for today → treat as not taken (daily reset)
      return { ...med, taken: false };
    });

    return { ...rx, [key]: updatedMeds };
  });
};
