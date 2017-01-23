## Unreleased

## [0.0.1] - 2017-01-23

First version.  Added draft of infrastructure and four initial plugins, started documentation.

### Added

- `Aragonite` contains configuration handling, plugin loading, and relays messages between plugins.
  - `AragoniteReportInterface` handles relaying to plugins, as there are many methods
- Basic CLI.
  - Only supports core Aragonite options, not options added by plugins.
- Report template and started GoodBadReport to document a standard reporting format.
- Abstract plugin definitions
- `Environment`/`EnvironmentRunner` to group environment runs
- Start of `http-input` plugin
  - Accepts GET requests to `/`, collects build information and optional file upload, and triggers a build.
- Start of `aragonite-vbox`:
  - Listens to input triggers
  - Creates `VBoxEnvironment` instances for each VirtualBox machine that should be run
  - Limits resources to prevent machine over-utilization (`async: false` or `cost` calculation)
  - Clones pre-created VirtualBox machines to run tests in
  - Spawns cloned machines, communicates run details, relays run results to reporters, cleans up machines when finished.
- Start of `aragonite-socket-reporter`
  - Relays run results (started, report, finished, error) via sockets
