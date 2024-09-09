import { FileSystemCache } from 'file-system-cache';

export const openAIMatchupAnalysisCache = new FileSystemCache({
    basePath: "./.cache", // (optional) Path where cache files are stored (default).
    ns: "openapi",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
    ttl: 60 * 60 * 96               // (optional) A time-to-live (in secs) on how long an item remains cached.
});