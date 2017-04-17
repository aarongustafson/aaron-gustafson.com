client
dev tap
proto udp
dev-node NETGEAR-VPN
remote 23.251.66.208 12974
resolv-retry infinite
nobind
persist-key
persist-tun
ca ca.crt
cert client.crt
key client.key
cipher AES-128-CBC
comp-lzo
verb 5
