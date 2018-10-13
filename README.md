# generator-jhipster-spring-cloud-stream
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module for messaging microservices with Spring Cloud Stream

<div align="center">
  <a href="http://jhipster.github.io">
    <img src="https://raw.githubusercontent.com/jhipster/jhipster.github.io/master/images/logo/logo-jhipster.png">
  </a>
  <a href="https://www.rabbitmq.com">
    <img width=300px src="https://raw.githubusercontent.com/hipster-labs/generator-jhipster-spring-cloud-stream/master/images/rabbitmq.png">
  </a>
</div>

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Installation

## With NPM

To install this module:

```bash
npm install -g generator-jhipster-spring-cloud-stream
```

To update this module:

```bash
npm update -g generator-jhipster-spring-cloud-stream
```

## With Yarn

To install this module:

```bash
yarn global add generator-jhipster-spring-cloud-stream
```

To update this module:

```bash
yarn global upgrade generator-jhipster-spring-cloud-stream
```

# Usage

In your JHipster project, launch:

```
yo jhipster-spring-cloud-stream
```

This module will:
- add new dependencies: `spring-cloud-stream-dependencies`
- add configuration to your `application-dev.yml` and `application-prod.yml`
- add a new endpoint, so you can get and send messages
- a new docker-compose file: `rabbitmq.yml`

Don't forget to start your RabbitMQ with:

```
docker-compose -f src/main/docker/rabbitmq.yml up -d
```

Then, start your project, go to Swagger UI and test the endpoint.

# License

Apache-2.0 © [Pascal Grimaud](https://twitter.com/pascalgrimaud) and the respective JHipster contributors

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-spring-cloud-stream.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-spring-cloud-stream
[travis-image]: https://travis-ci.org/hipster-labs/generator-jhipster-spring-cloud-stream.svg?branch=master
[travis-url]: https://travis-ci.org/hipster-labs/generator-jhipster-spring-cloud-stream
[daviddm-image]: https://david-dm.org/hipster-labs/generator-jhipster-spring-cloud-stream.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/hipster-labs/generator-jhipster-spring-cloud-stream
