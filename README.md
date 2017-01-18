# Aragonite
[![Travis CI](https://travis-ci.org/rweda/aragonite.svg?branch=master)](https://travis-ci.org/rweda/aragonite)

Automatically test projects across multiple environments on your own infrastructure.

Aragonite is an open-source, self-hosted server that can manage testing environments across platforms and browsers,
interacting with users or automated CI systems to start tests and return test results.

## Plugins

Aragonite ships with four plugins, but they can be easily replaced to provide different functionality.

- **[Input]** `aragonite-http-input` 
  provides an HTTP API that can automatically start environments, so CI jobs can trigger automatic testing.
- **[Runner]** `aragonite-vbox` 
  manages and communicates with [VirtualBox][] machines, allowing tests to be run on different platforms.
- **[Reporter]** `aragonite-socket-reporter`
  collects test results from different environments, and transmits the data over a Socket API for CI machines.
- **[Storage]** `aragonite-storage`
  stores test artifacts and screen recordings of test runs.

Plugins are split into four categories: Input, Runner, Reporter, and Storage.
See the full ~~[plugin list][]~~ for existing plugins that can be added to Aragonite, or see the
~~[plugin documentation][]~~ to learn how to author your own plugin.

## Usage

See [Usage with Web Component Tester][] for a guide using Aragonite to test browser components.

[plugin list]: https://github.com/rweda/aragonite/wiki
[plugin documentation]: https://github.com/rweda/aragonite/wiki
[Usage with Web Component Tester]: https://github.com/rweda/aragonite/wiki/Usage-with-Web-Component-Tester
