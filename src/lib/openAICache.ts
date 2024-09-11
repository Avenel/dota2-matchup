import { FileSystemCache } from 'file-system-cache';

export const draftAnalysisCache = new FileSystemCache({
    basePath: "./.cache/draftAnalysisCache", // (optional) Path where cache files are stored (default).
    ns: "draftAnalysisCache",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key
});