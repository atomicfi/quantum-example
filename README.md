# Quantum

Quantum is a framework to manage Atomic's [TrueAuth](https://www.trueauth.com/) technology. With Quantum, you can create and manage your own TrueAuth browsers.

There are two packages required to use Quantum:
1. Either [QuantumIOS](https://github.com/atomicfi/quantum-ios) or QuantumAndroid
2. [QuantumJS](https://github.com/atomicfi/quantum-js)

This repo provides examples of how to integrate the native SDKs and the web layer that allows Quantum to function.

## Getting Started

Reach out to AtomicFI to request access to the QuantumJS and MuppetJS respositories. Create a personal access token in Github that uses the `read:packages` scope. This token will be used to install the Atomic packages. Add this PAT to your shell profile as `ATOMIC_PACKAGES_TOKEN`.

```shell
$ cd webapp
$ npm install

# To run the iOS Example
$ npm run start:ios
```
