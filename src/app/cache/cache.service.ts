import { Injectable } from '@angular/core';

/**
 * A simple wrapper type for a cache item.
 */
interface CacheEntry<T> {
  /**
   * The timestamp of the last save operation.
   */
  lastUpdated: number;

  /** The cached data */
  data: T;
}

function isCacheEntry<T>(value: unknown): value is CacheEntry<T> {
  return typeof value === 'object' 
    && value.hasOwnProperty('lastUpdated')
    && value.hasOwnProperty('data');
}

/**
 * A simple cache service based on localStorage. For each item the the current timestamp is saved too.
 */
@Injectable()
export class CacheService {
  constructor() {}

  /** Save a new entry to the cache based on a key
   * @param {string} key - the key of the new entry, should be unique
   * @param {T} data - the data to be saved
  */
  public save<T>(key: string, data: T) {
    const entry: CacheEntry<T> = {
      lastUpdated: Date.now(),
      data: data,
    }

    localStorage.setItem(key, JSON.stringify(entry));
  }

  /**
   * Deletes an entry from the cache
   * @param {string} key - the key of the entry to be removed
   */
  public remove(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Searches and returns (if presented) a cache entry based on the provided key.
   * @param {string} key - the of the item to find
   * @returns {CacheEntry<T> | undefined} - the found entry or undefined if the give key was not presented in the cache.
   * @throws Error - if the found entry is not a valid CacheEntry 
   */
  public find<T>(key: string): CacheEntry<T> | undefined {
    const entry = JSON.parse(localStorage.getItem(key));
    if (entry && !isCacheEntry<T>(entry)) {
      throw new Error('Invalid cahce entry!');
    } 

    return entry;
  };
}
