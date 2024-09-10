import { FileSystemCache } from 'file-system-cache';

export const openAIMatchupAnalysisCache = new FileSystemCache({
    basePath: "./.cache/matchupAnalysis", // (optional) Path where cache files are stored (default).
    ns: "matchupAnalysis",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key
});