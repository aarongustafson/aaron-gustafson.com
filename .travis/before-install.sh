#!/bin/bash

openssl aes-256-cbc -K $encrypted_bb5b178a0863_key -iv $encrypted_bb5b178a0863_iv -in .travis/id_rsa_travis.enc -out .travis/id_rsa -d