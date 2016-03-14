# Docker Machine UNFS

Activates [NFS](https://en.wikipedia.org/wiki/Network_File_System) for an
existing boot2docker box created through
[Docker Machine](https://docs.docker.com/machine/).

Serves files using User-space NFS [UNFS3](http://unfs3.sourceforge.net/)
instead of kernel-space NFS.

## Requirements

* Mac OS X 10.9+
* [Docker Machine](https://docs.docker.com/machine/) 0.5.0+

## Install

```sh
curl -s https://raw.githubusercontent.com/erikwilson/docker-machine-unfs/master/docker-machine-unfs \
  >/usr/local/bin/docker-machine-unfs && \
  chmod +x /usr/local/bin/docker-machine-unfs
```

## Supports

* Virtualbox
* Paralells
* VMware Fusion
* xhyve

## Usage

```sh


                       ##         .
                 ## ## ##        ==            _   _ _   _ _____ ____
              ## ## ## ## ##    ===           | | | | \ | |  ___/ ___|
          /"""""""""""""""""\___/ ===         | | | |  \| | |_  \___ \
     ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~  | \_/ | |\  |  _|  ___) |
          \______ o           __/              \___/|_| \_|_|   |____/
            \    \         __/
             \____\_______/


Usage: ./docker-machine-unfs <machine-name> [options]

Options:

  -n, --nfs-config       NFS configuration to use in exports file.
                          (default to 'rw')
  -s, --shared-folder    Folder to share
                          (default to '/Users/erik')
  -m, --mount-opts       NFS mount options
                          (default to 'nfsvers=3,port={{PORT}},mountport={{PORT}},udp,nolock,hard,intr')
  -e, --exports          Exports file to use
                          (default to '/tmp/{{MACHINE}}.exports')
  -p, --port             Port to use for NFS server
                          (default to random port)
  -f, --force            Force reconfiguration of nfs
                          (default to false)
  -r, --reboot           Reboot machine instead of restarting services
                          (default to false)

Examples:

  $ docker-machine-unfs test

    > Configure the HOME folder with NFS for machine test

  $ docker-machine-unfs test --shared-folder=/Users --shared-folder=/var/www

    > Configures the /Users and /var/www folder with NFS

  $ docker-machine-unfs test --shared-folder=/var/www --nfs-config="ro"

    > Configure the /var/www folder with NFS and the options 'ro'

  $ docker-machine-unfs test --mount-opts="noacl,async,nolock,vers=3,udp,noatime,actimeo=1"

    > Configure the /User folder with NFS and specific mount options.

```

## Credits

Heavily inspired by @[mattes](https://github.com/mattes) ruby version
[boot2docker-nfs.rb](https://gist.github.com/mattes/4d7f435d759ca2581347).

Forked from [docker-machine-nfs](https://github.com/adlogix/docker-machine-nfs).

Influenced by [Dinghy](https://github.com/codekitchen/dinghy/).
