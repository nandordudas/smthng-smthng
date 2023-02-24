ARG VARIANT=16-bullseye

FROM mcr.microsoft.com/devcontainers/typescript-node:0-${VARIANT}

ARG USERNAME

USER $USERNAME

RUN \
  npm install --global @antfu/ni npkill taze
