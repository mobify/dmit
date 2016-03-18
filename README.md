# dmit
Wrapper for docker-machine with built-in NFS and environment handling

Currently in alpha status awaiting more usage.

## Usage

```bash
dmit create <machine>
dmit enter <machine>
dmit export /some/local/dir /machine/mount
```

dmit is a tool that provides a streamlined experience with using
docker-machine. Upon creation of a new machine, you can "enter" the machine
to gain a shell session that has the docker-machine environment variables
pre-set.

While in this session you can use "export" to make directories available
to your machine for development purposes. This uses a standalone userspace
NFS server that requires no special access to your system, allowing you to
work smoothly without worrying about system NFS.

dmit defaults to using virtual box as the VM driver as well as using RancherOS
as the default image used.

## Install

dmit currently requires the following from homebrew:

* `brew install unfs3`
* `brew cask install virtualbox`
* `brew cask install virtualbox-extension-pack`
* `brew install docker-machine` NB: Please use docker-machine version 0.6.0

Don't forget to `npm install .` in the repo directory!

dmit is pluggable, so if you want to support different images or VM drivers
you can submit a PR to have them added.

For now, you can use dmit from github, but in time it will be made available
on npm

## Licence

MIT - See LICENSE file for full text.

## Authors

&copy; 2016 Mobify Inc.

Currently maintained by Scott McWhirter

