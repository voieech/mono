# =============== To build an image with this Dockerfile =======================
# docker build -t voieech-api -f ./.Dockerfile .
#
# =============== To debug docker image build process ==========================
# docker build --progress plain --no-cache -t voieech-api -f ./.Dockerfile .
#
# =============== To run the image built with this Dockerfile ==================
# docker run -d --rm -p 3000:3000 --env-file ./.env --name voieech-api voieech-api
#
# Why is RUN used and why they are split up:
# Use RUN instruction to install packages required by executing commands on top
# of the current image to create a new layer by committing the results. The RUN
# commands are all split up as different ephemeral intermmediate images to
# optimize the build process for caching.

# Use alpine image to reduce image size
FROM node:lts-alpine

WORKDIR /server

# Set NODE_ENV to production so that any libraries that will be optimized with
# this will be done so automatically.
ENV NODE_ENV production

# Copy package.json files and install dependencies so that source code in later
# docker layers will not invalidate this layer.
# "clean-install" by default will only install dependencies and skip
# devDependencies as NODE_ENV is set to 'production', however since
# devDependencies are still needed later on like for build/linting/etc..., the
# --include flag is used to include all dependencies for installation.
# Using --force flag because of eslint peer dependency issues.
COPY ./package*.json ./
RUN npm clean-install --include=dev --include=optional --include=peer --force

# Copy over in order of which is most likely to change at the bottom
COPY ./tsconfig.json ./tsconfig.json
COPY ./src/ ./src/

# Build
RUN npm run build

# Define exposed ports, acting only as documentation. Docker run STILL need to
# map the ports with -p option.
EXPOSE 3000

# Run as "node" user instead of "root"
# https://docs.docker.com/reference/dockerfile/#user
# https://www.docker.com/blog/understanding-the-docker-user-instruction/
# https://youtu.be/WLsFF4mtqXQ?t=684
USER node

# ENTRYPOINT Command ensures this command runs when the container is spun up
# and cannot be overwritten with shell arguements like CMD.
# Use exec form instead of shell form to run it as the main process.
ENTRYPOINT ["npm", "run", "start"]