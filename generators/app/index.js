const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const utilYaml = require('./utilYaml.js');

const RABBITMQ = 'RabbitMQ';
const KAFKA = 'Kafka';
const DEFAULT_BROKER_TYPE = RABBITMQ;
const DEFAULT_RABBITMQ_MESSAGE_NAME = 'message';

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    this.defaultOptions = true;
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                const logo = '\n' +
                    `${chalk.bold.yellow('               ████    ████        \n')}` +
                    `${chalk.bold.yellow('               ████    ████        \n')}` +
                    `${chalk.bold.yellow('               ████    ████        \n')}` +
                    `${chalk.bold.yellow('               ████    ████        \n')}` +
                    `${chalk.bold.yellow('               ████████████████████\n')}` +
                    `${chalk.bold.yellow('               ████████████████████\n')}` +
                    `${chalk.bold.yellow('               ████████████    ████\n')}` +
                    `${chalk.bold.yellow('               ████████████    ████\n')}` +
                    `${chalk.bold.yellow('               ████████████████████\n')}` +
                    `${chalk.bold.yellow('               ████████████████████')}`;
                this.log(logo);

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster spring-cloud-stream')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
                }
            },
            checkKafka() {
                if (this.jhipsterAppConfig.messageBroker === 'kafka') {
                    this.error('You already have Kafka in your project, no need to add RabbitMQ.');
                }
            },
        };
    }

    prompting() {
        const done = this.async();

        const prompts = [{
            type: 'list',
            name: 'messageBrokerType',
            message: `Which ${chalk.yellow('*type*')} of message broker would you like to add?`,
            choices: [
                {
                    value: RABBITMQ,
                    name: 'RabbitMQ message broker (recommended for simple projects)'
                },
                {
                    value: KAFKA,
                    name: 'Kafka message broker (recommended for advanced projects)'
                }
            ],
            store: true,
            default: DEFAULT_BROKER_TYPE
        },
        {
            when: response => response.messageBrokerType === RABBITMQ,
            type: 'input',
            name: 'rabbitMqNameOfMessage',
            message: 'Please choose the name of the message class use by rabbit',
            default: DEFAULT_RABBITMQ_MESSAGE_NAME,
            store: true
        }];
        if (this.defaultOptions) {
            this.messageBrokerType = DEFAULT_BROKER_TYPE;
            this.rabbitMqNameOfMessage = DEFAULT_RABBITMQ_MESSAGE_NAME;
            this.writing();
            done();
        } else {
            this.prompt(prompts).then((props) => {
                this.props = props;
                // variable from questions
                this.messageBrokerType = this.props.messageBrokerType;
                if (this.props.messageBrokerType === RABBITMQ) {
                    this.rabbitMqNameOfMessage = this.props.rabbitMqNameOfMessage;
                }
                this.writing();
                done();
            });
        }
    }

   writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };
        this.log(this.messageBrokerType);
        switch (this.messageBrokerType) {
        case RABBITMQ:
            this._installRabbitMq();
            break;
        case KAFKA:
            this._installKafka();
            break;
        default:
            break;
        }
    }

   end() {
        this.log('End of spring-cloud-stream generator');
    }

 _installRabbitMq() {

        const STREAM_RABBIT_VERSION = '1.3.0.RELEASE';
        const STREAM_CLOUD_DEPENDENCY_VERSION = 'Chelsea.SR2';
        const STREAM_CLOUD_STREAM_VERSION = '1.3.0.RELEASE';

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
        this.log(`\nmessage broker type = ${this.messageBrokerType}`);
        this.log(`\nRabbitMQ message name = ${this.rabbitMqNameOfMessage}`);
        this.log('------\n');

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        // add dependencies
        if (this.buildTool === 'maven') {
            if (typeof this.addMavenDependencyManagement === 'function') {
                this.addMavenDependencyManagement('org.springframework.cloud', 'spring-cloud-stream-dependencies', STREAM_CLOUD_DEPENDENCY_VERSION, 'pom', 'import');
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream');
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-starter-stream-rabbit');
            } else {
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream', STREAM_CLOUD_STREAM_VERSION);
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-starter-stream-rabbit', STREAM_RABBIT_VERSION);
            }
        } else if (this.buildTool === 'gradle') {
            if (typeof this.addGradleDependencyManagement === 'function') {
                this.addGradleDependencyManagement('mavenBOM', 'org.springframework.cloud', 'spring-cloud-stream-dependencies', STREAM_CLOUD_DEPENDENCY_VERSION);
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-stream');
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-starter-stream-rabbit');
            } else {
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-stream', STREAM_CLOUD_STREAM_VERSION);
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-starter-stream-rabbit', STREAM_RABBIT_VERSION);
            }
        }

        // add docker-compose file
        this.template('src/main/docker/_rabbitmq.yml', 'src/main/docker/rabbitmq.yml');
        const messageName = this.rabbitMqNameOfMessage.charAt(0).toUpperCase() + this.rabbitMqNameOfMessage.slice(1);
        this.rabbitMessageName = messageName;
        this.rabbitMessageNameNonUcFirst = messageName.charAt(0).toLowerCase() + messageName.slice(1);

        // add Java classes
        this.template('src/main/java/package/domain/_JhiMessage.java', `${javaDir}domain/Jhi${this.rabbitMessageName}.java`);
        this.template('src/main/java/package/service/stream/_MessageSink.java', `${javaDir}service/stream/${this.rabbitMessageName}Sink.java`);
        this.template('src/main/java/package/web/rest/_MessageResource.java', `${javaDir}web/rest/${this.rabbitMessageName}Resource.java`);

        // application-dev.yml
        const yamlAppDevProperties = {};
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.default.contentType', this, 'application/json');
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.input.destination', this, 'topic-jhipster');
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.output.destination', this, 'topic-jhipster');
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression', this, 'headers.title');
        utilYaml.updateYamlProperties(`${resourceDir}config/application-dev.yml`, yamlAppDevProperties, this);

        // application-prod.yml
        const yamlAppProdProperties = yamlAppDevProperties;
        utilYaml.updatePropertyInArray(yamlAppProdProperties, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression', this, 'payload.title');
        utilYaml.updateYamlProperties(`${resourceDir}config/application-prod.yml`, yamlAppProdProperties, this);
      this.end();
    }

    _installKafka() {

        const STREAM_KAFKA_VERSION = '1.2.1.RELEASE';
        const STREAM_CLOUD_DEPENDENCY_VERSION = 'Chelsea.SR2';
        const STREAM_CLOUD_STREAM_VERSION = '1.3.0.RELEASE';

        const DOCKER_KAFKA = 'wurstmeister/kafka:0.10.1.1';
        const DOCKER_ZOOKEEPER = 'wurstmeister/zookeeper:3.4.6';

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
        this.log(`\nmessage broker type = ${this.messageBrokerType}`);
        this.log('------\n');

        // add dependencies
        if (this.buildTool === 'maven') {
            if (typeof this.addMavenDependencyManagement === 'function') {
                this.addMavenDependencyManagement('org.springframework.cloud', 'spring-cloud-stream-dependencies', STREAM_CLOUD_DEPENDENCY_VERSION, 'pom', 'import');
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream');
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream-binder-kafka');
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream-test-support', null,'            <scope>test</scope>');
            } else {
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream', STREAM_CLOUD_STREAM_VERSION);
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream-binder-kafka', STREAM_KAFKA_VERSION);
                this.addMavenDependency('org.springframework.cloud', 'spring-cloud-stream-test-support', STREAM_KAFKA_VERSION, '            <scope>test</scope>');
            }
        } else if (this.buildTool === 'gradle') {
            if (typeof this.addGradleDependencyManagement === 'function') {
                this.addGradleDependencyManagement('mavenBOM', 'org.springframework.cloud', 'spring-cloud-stream-dependencies', STREAM_CLOUD_DEPENDENCY_VERSION);
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-stream');
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-stream-binder-kafka');
                this.addGradleDependency('compile', 'org.springframework.kafka', 'spring-kafka');
            } else {
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-stream');
                this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-stream-binder-kafka');
                this.addGradleDependency('compile', 'org.springframework.kafka', 'spring-kafka');
            }
        }


        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const testResourceDir = jhipsterConstants.SERVER_TEST_RES_DIR;

        this.DOCKER_KAFKA = DOCKER_KAFKA;
        this.DOCKER_ZOOKEEPER = DOCKER_ZOOKEEPER;
        // add docker-compose file
        this.template('src/main/docker/_kafka.yml', 'src/main/docker/kafka.yml');

        // config
        this.template(`src/main/java/package/config/_MessagingConfiguration.java`, `${javaDir}config/MessagingConfiguration.java`);


        // application.yml
        const yamlAppProperties = {};
        utilYaml.updatePropertyInArray(yamlAppProperties, 'management.health.binders.enabled', this, 'true');
        utilYaml.updateYamlProperties(`${resourceDir}config/application.yml`, yamlAppProperties, this);

        // application-dev.yml
        const yamlAppDevProperties = {};
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.kafka.binder.brokers', this, 'localhost');
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.kafka.binder.zk-node', this, 'localhost');
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.output.destination', this, 'topic-jhipster');
        utilYaml.updateYamlProperties(`${resourceDir}config/application-dev.yml`, yamlAppDevProperties, this);

        // application-prod.yml
        const yamlAppProdProperties = {};
        utilYaml.updatePropertyInArray(yamlAppProdProperties, 'spring.cloud.stream.kafka.binder.brokers', this, 'localhost');
        utilYaml.updatePropertyInArray(yamlAppProdProperties, 'spring.cloud.stream.kafka.binder.zk-node', this, 'localhost');
        utilYaml.updatePropertyInArray(yamlAppProdProperties, 'spring.cloud.stream.bindings.output.destination', this, 'topic-jhipster');
        utilYaml.updateYamlProperties(`${resourceDir}config/application-prod.yml`, yamlAppProdProperties, this);

        // test : application.yml
        const yamlAppTestProperties = {};
        utilYaml.updatePropertyInArray(yamlAppTestProperties, 'spring.cloud.stream.kafka.binder.brokers', this, 'localhost');
        utilYaml.updatePropertyInArray(yamlAppTestProperties, 'spring.cloud.stream.kafka.binder.zk-node', this, 'localhost');
        utilYaml.updatePropertyInArray(yamlAppTestProperties, 'spring.cloud.stream.bindings.output.destination', this, 'topic-jhipster');
        utilYaml.updateYamlProperties(`${testResourceDir}config/application.yml`, yamlAppTestProperties, this);


        // TODO add logback-spring.xml property
        // TODO add logback.xml property
        this.end();
    }

};
