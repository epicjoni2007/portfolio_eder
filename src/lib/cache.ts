import fs from 'fs';
import path from 'path';

const CACHE_DIR = '.cache';
const CACHE_FILE = path.join(CACHE_DIR, 'github-repos.json');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedRepos {
  repos: any[];
  timestamp: number;
}

export function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function isCacheExpired(): boolean {
  if (!fs.existsSync(CACHE_FILE)) {
    return true;
  }
  
  try {
    const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as CachedRepos;
    const now = Date.now();
    return now - cached.timestamp > CACHE_TTL;
  } catch {
    return true;
  }
}

export function getCachedRepos(): any[] | null {
  if (!fs.existsSync(CACHE_FILE)) {
    return null;
  }
  
  try {
    const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as CachedRepos;
    return cached.repos;
  } catch {
    return null;
  }
}

export function saveCachedRepos(repos: any[]): void {
  ensureCacheDir();
  const data: CachedRepos = {
    repos,
    timestamp: Date.now()
  };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function clearCache(): void {
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
  }
}
