const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const utils = require('./utils');
const fse = require('fs-extra');

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
            }
        };
    }

    prompting() {
        const done = this.async();
        this.fs.readFileSync = fse.readFileSync;
        this.fs.writeFileSync = fse.writeFileSync;
        const DEFAULT_BROKER_TYPE = 'RabbitMQ';
        const prompts = {
            type: 'list',
            name: 'messageBrokerType',
            message: `Which ${chalk.yellow('*type*')} of message broker would you like to add?`,
            choices: [
                {
                    value: DEFAULT_BROKER_TYPE,
                    name: 'RabbitMQ message broker (recommended for simple projects)'
                },
                {
                    value: 'kafka',
                    name: 'Kafka message broker (recommended for advanced projects) not implemented yet'
                }
            ],
            default: DEFAULT_BROKER_TYPE
        };
        if (this.defaultOptions) {
            this.messageBrokerType = DEFAULT_BROKER_TYPE;
            done();
        } else {
            this.prompt(prompts).then((props) => {
                this.props = props;
                // To access props later use this.props.someOption;

                // variable from questions
                this.messageBrokerType = this.props.messageBrokerType;
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

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        // const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        this.log(`\nmessage broker type = ${this.messageBrokerType}`);
        this.log('------\n');

        // add dependencies
        if (this.buildTool === 'maven') {
            this.addMavenDependency('org.springframework.cloud', 'spring-cloud-starter-stream-rabbit', '1.3.0.RELEASE');
        } else if (this.buildTool === 'gradle') {
            this.addGradleDependency('compile', 'org.springframework.cloud', 'spring-cloud-starter-stream-rabbit', '1.3.0.RELEASE');
        }

        // add docker-compose file
        this.template('src/main/docker/_rabbitmq.yml', 'src/main/docker/rabbitmq.yml');

        // add Java classes
        this.template('src/main/java/package/domain/_JhiMessage.java', `${javaDir}domain/JhiMessage.java`);
        this.template('src/main/java/package/service/stream/_MessageSink.java', `${javaDir}service/stream/MessageSink.java`);
        this.template('src/main/java/package/web/rest/_MessageResource.java', `${javaDir}web/rest/MessageResource.java`);

        // application-dev.yml
        const yamlAppDevProperties = {};
        // utils.updateYamlProperty(`${resourceDir}config/application-dev.yml`, 'spring.cloud.stream.default.contentType',  'application/json', this);
        // utils.updateYamlProperty(`${resourceDir}config/application-dev.yml`, 'spring.cloud.stream.bindings.input.destination' , 'topic-jhipster', this)
        // utils.updateYamlProperty(`${resourceDir}config/application-dev.yml`, 'spring.cloud.stream.bindings.output.destination','topic-jhipster', this );
        //   utils.updateYamlProperty(`${resourceDir}config/application-dev.yml`, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression','headers.title', this );
        utils.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.default.contentType', this, 'application/json');
        utils.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.input.destination', this, 'topic-jhipster');
        utils.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.output.destination', this, 'topic-jhipster');
        utils.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression', this, 'headers.title');
        utils.updateYamlProperties(`${resourceDir}config/application-dev.yml`, yamlAppDevProperties, this);

        // application-prod.yml
        const yamlAppProdProperties = yamlAppDevProperties;
        utils.updatePropertyInArray(yamlAppProdProperties, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression', this, 'payload.title');
        utils.updateYamlProperties(`${resourceDir}config/application-prod.yml`, yamlAppProdProperties, this);


        // utils.addYamlPropertiesAfterAnotherProperty(`${resourceDir}config/application-dev.yml`, yamlAppDevProperties, this, 'liquibase');
        // utils.addYamlPropertyAfterAnotherProperty(`${resourceDir}config/application-dev.yml`, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression', 'headers.title',  this, 'liquibase');

        // const body = this.fs.read(`${resourceDir}config/application-dev.yml`);
        // utils.getLastPropertyCommonHierarchy(body, 'toto.spring.profiles.cloud.stream.default.contentType', this,  true);
        // utils.addYamlPropertiesBeforeAnotherProperty(`${resourceDir}config/application-dev.yml`, yamlAppDevProperties, this, 'application', true);
        // const property_value=utils.getYamlProperty(`${resourceDir}config/application-dev.yml`, 'jhipster.cache.ehcache.time-to-live-seconds', this);
        // this.log(`\nproperty value of jhipster.cache.ehcache.time-to-live-seconds : ${property_value}\n`);
        // utils.updateYamlProperty(`${resourceDir}config/application-dev.yml`, this, 'jhipster.cache.ehcache.time-to-live-seconds', 'toto');
        //
        // utils.deleteYamlProperty(`${resourceDir}config/application-dev.yml`, this, 'jhipster.cache.ehcache.time-to-live-seconds');
        // const property_delete=utils.getYamlProperty(`${resourceDir}config/application-dev.yml`, 'jhipster.cache.ehcache.time-to-live-seconds', this);
        // this.log(`\nproperty value of jhipster.cache.ehcache.time-to-live-seconds : ${property_delete}\n`);

        // add Spring Boot configuration
    }

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    }

    end() {
        this.log('End of spring-cloud-stream generator');
    }
};
