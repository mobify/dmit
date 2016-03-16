# dmit
Wrap docker-machine in useful functionality

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

## Install

dmit currently requires the following from homebrew:

* `brew install unfs3`
* `brew cask install virtualbox`
* `brew cask install virtualbox-extension-pack`
* `brew install docker-machine`

For now, you can use dmit from github, but in time it will be made available
on npm

## Licence

(c) 2016 Mobify - Scott McWhirter
