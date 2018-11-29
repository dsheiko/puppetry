# Publishing with Snapcraft.io

- https://snapcraft.io/

## Debugging

```
sudo snap install lxd && sudo lxd init # if you don’t have LXD already
sudo usermod -a -G lxd $USER && newgrp lxd # if your user is not in the lxd group already
sudo snap install --classic snapcraft # if you don’t have snapcraft already

git clone https://github.com/dsheiko/puppetry
cd puppetry
snapcraft cleanbuild --debug
```