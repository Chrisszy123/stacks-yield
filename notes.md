
To summarize what the root cause was and what fixed it:
Root cause: Clarinet stores a devnet events cache at ~/.clarinet/cache/devnet/events_export/events_cache.tsv. This file was from May 2025 and incompatible with the current stacks-api version. On startup, clarinet would:
Create the stacks-api container
Try to import the stale events cache into it
The import would fail, crashing the stacks-api container
Without the stacks-api, the stacks-node couldn't dispatch events to it — so it stayed permanently stuck on "booting"
The fix: Delete (or rename) the stale events_cache.tsv, clear the old project .cache/stacks-devnet-* directories, and restart. The devnet then boots cleanly without the failed import.
If this happens again in the future, run these two commands:
mv ~/.clarinet/cache/devnet/events_export/events_cache.tsv ~/.clarinet/cache/devnet/events_export/events_cache.tsv.bakrm -rf /path/to/your/project/.cache/stacks-devnet-*
Then restart clarinet devnet start.