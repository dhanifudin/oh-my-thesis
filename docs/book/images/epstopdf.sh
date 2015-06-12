#!/usr/bin/env bash

for file in *.eps; do
  epstopdf $file
done
