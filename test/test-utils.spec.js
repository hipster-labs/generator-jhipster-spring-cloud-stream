/* global describe, beforeEach, it */

// const utils = require('../generators/app/utilYaml');
const fse = require('fs-extra');
// const fs = require('fs');
const chai = require('chai');
// Load dirty chai first to hook plugin extensions
const dirtyChai = require('dirty-chai');
const path = require('path');
// const crypto = require('crypto');
const os = require('os');
const jsyaml = require('js-yaml');

chai.use(dirtyChai);
const expect = chai.expect;
// const BaseGenerator = require('generator-jhipster/generators/generator-base');
const BaseGenerator = require('../generators/app/index').prototype;
const utilYaml = require('../generators/app/utilYaml');
// const BaseGenerator = this;
BaseGenerator.log = (msg) => {
    console.log(msg);// eslint-disable-line no-console
};
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');

const store = memFs.create();
const fs = editor.create(store);
BaseGenerator.fs = fs;
process.on('unhandledRejection', (error) => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error.stack);// eslint-disable-line no-console
});
function copyYamlTemp(filesrc, nameFileDest) {
    // const filesrc = path.join(__dirname, filesrc);
    const tmpdir = fse.mkdtempSync(path.join(os.tmpdir(), 'jhipster-'));
    const file = path.join(tmpdir, nameFileDest);
    // BaseGenerator.fs.createReadStream(path.join(__dirname, filesrc)).pipe(BaseGenerator.fs.createWriteStream(file));
    fse.copySync(path.join(__dirname, filesrc), file);
    // fse.readFileSync(file);

    return file;
}

function deleteDirTemp(file) {
    fse.unlinkSync(file);
    fse.rmdirSync(path.dirname(file));
}


describe('JHipster generator spring-cloud-stream', () => {
    describe('Test array property', () => {
        describe('Get array property', () => {
            it('get property on array null', () => {
                const result = utilYaml.getPropertyInArray(null, 'test', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get property on array empty', () => {
                const result = utilYaml.getPropertyInArray({ }, 'test', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get a simple property that does not exist in a non-empty array', () => {
                const array = ['spring', 'application'];
                const result = utilYaml.getPropertyInArray(array, 'test', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get a property that does not exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                const result = utilYaml.getPropertyInArray(yaml, 'spring.cloud.toto', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get a simple property that exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                const result = utilYaml.getPropertyInArray(yaml, 'spring', BaseGenerator);
                expect(result).eql({ cloud: 'stream' });
            });
            it('get a property that exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                const result = utilYaml.getPropertyInArray(yaml, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
            });
            it('get a property that exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                const result = utilYaml.getPropertyInArray(yaml, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
            });
        });
        describe('add/Update array property', () => {
            it('update property on array null', () => {
                const result = utilYaml.updatePropertyInArray(null, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('update property on array empty', () => {
                const result = utilYaml.updatePropertyInArray({ }, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('add a simple property that does not exist in a non-empty array', () => {
                const array = ['spring', 'application'];
                utilYaml.updatePropertyInArray(array, 'toto', BaseGenerator, 'value');
                const result = utilYaml.getPropertyInArray(array, 'toto', BaseGenerator);
                expect(result).eql('value');
            });
            it('update a simple property that exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                utilYaml.updatePropertyInArray(yaml, 'spring', BaseGenerator, 'value');
                const result = utilYaml.getPropertyInArray(yaml, 'spring', BaseGenerator);
                expect(result).eql('value');
            });
            it('update a property that exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                utilYaml.updatePropertyInArray(yaml, 'spring.cloud', BaseGenerator, 'value');
                const result = utilYaml.getPropertyInArray(yaml, 'spring.cloud', BaseGenerator);
                expect(result).eql('value');
            });
        });
        describe('Delete array property', () => {
            it('Delete property on array null', () => {
                const result = utilYaml.deletePropertyInArray(null, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('Delete property on array empty', () => {
                const result = utilYaml.deletePropertyInArray({ }, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('Delete a simple property that does not exist in a non-empty array', () => {
                const yaml = { spring: { cloud: 'stream' }, application: null };
                utilYaml.deletePropertyInArray(yaml, 'toto', BaseGenerator);
                const length = Object.keys(yaml).length;
                expect(length).eql(2);
            });
            it('Delete a simple property that exist in a non-empty array', () => {
                const yaml = {
                    spring: {
                        cloud: 'stream',
                        profiles: 'dev'
                    },
                    application: null
                };
                utilYaml.deletePropertyInArray(yaml, 'application', BaseGenerator);
                expect(Object.keys(yaml).length).eql(1);
                expect(Object.keys(yaml.spring).length).eql(2);
            });
            it('Delete a  property that  exist in a non-empty array', () => {
                const yaml = {
                    spring: {
                        cloud: 'stream',
                        profiles: 'dev'
                    },
                    application: null
                };
                utilYaml.deletePropertyInArray(yaml, 'spring.cloud', BaseGenerator);
                const length = Object.keys(yaml.spring).length;
                expect(length).eql(1);
            });
        });
    });
    describe('Test yaml property', () => {
        describe('Get YAML property', () => {
            it('get property that doesnt exist', () => {
                const file = path.join(__dirname, '../test/templates/utils/application-dev.yml');
                const result = utilYaml.getYamlProperty(file, 'toto', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get property on file empty', () => {
                const file = path.join(__dirname, '../test/templates/utils/yaml-empty.yml');
                const result = utilYaml.getYamlProperty(file, 'toto', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get property on file that doesn\'t exist', () => {
                const file = path.join(__dirname, '../test/templates/utils/application-totos.yml');
                expect(() => utilYaml.getYamlProperty(file, 'spring', BaseGenerator)).to.throw(/doesn't exist/);
            });
            it('get simple property that exist', () => {
                const file = path.join(__dirname, '../test/templates/utils/application-dev.yml');
                const result = utilYaml.getYamlProperty(file, 'liquibase', BaseGenerator);
                expect(result).eql({ contexts: 'dev' });
            });
            it('get property that exist', () => {
                const file = path.join(__dirname, '../test/templates/utils/application-dev.yml');
                const result = utilYaml.getYamlProperty(file, 'liquibase.contexts', BaseGenerator);
                expect(result).eql('dev');
            });
        });
        describe('Add YAML properties', () => {
            it('add properties at beginin of file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesAtBeginin(file, yaml, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const body = BaseGenerator.fs.read(file);
                const lines = body.split('\n');
                expect(lines[0].indexOf('toto:')).eql(0);
                deleteDirTemp(file);
            });
            it('add v at end of file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesAtEnd(file, yaml, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[lines.length - 3].indexOf('toto:')).eql(0);
                expect(lines[lines.length - 2].indexOf('cloud:')).not.eql(-1);
                expect(lines[lines.length - 2].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml properties before another property and his comment', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesBeforeAnotherProperty(file, yaml, BaseGenerator, 'jhipster', true);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[77].indexOf('toto:')).eql(0);
                expect(lines[78].indexOf('cloud:')).not.eql(-1);
                expect(lines[78].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml properties before another property without his comment', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesBeforeAnotherProperty(file, yaml, BaseGenerator, 'jhipster', false);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[83].indexOf('toto:')).eql(0);
                expect(lines[84].indexOf('cloud:')).not.eql(-1);
                expect(lines[84].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml properties before another property that don\'t exist', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                expect(() => utilYaml.addYamlPropertiesBeforeAnotherProperty(file, yaml, BaseGenerator, 'titi')).to.throw(/not found/);
                deleteDirTemp(file);
            });
            it('add yaml properties after another simple property', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesAfterAnotherProperty(file, yaml, BaseGenerator, 'jhipster');
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[127].indexOf('toto:')).eql(0);
                expect(lines[128].indexOf('cloud:')).not.eql(-1);
                expect(lines[128].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml properties after another property', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesAfterAnotherProperty(file, yaml, BaseGenerator, 'jhipster.logging.logstash');
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[127].indexOf('toto:')).eql(0);
                expect(lines[128].indexOf('cloud:')).not.eql(-1);
                expect(lines[128].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml properties after another property that don\'t exist', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                expect(() => utilYaml.addYamlPropertiesAfterAnotherProperty(file, yaml, BaseGenerator, 'titi')).to.throw(/not found/);
                deleteDirTemp(file);
            });
            it('add yaml properties at specific index line with no space', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.addYamlPropertiesAtLineIndex(file, yaml, BaseGenerator, 10, 0);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[10].indexOf('toto:')).eql(0);
                expect(lines[11].indexOf('cloud:')).not.eql(-1);
                expect(lines[11].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml properties at specific index line with space', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { cloud: 'stream' };
                utilYaml.addYamlPropertiesAtLineIndex(file, yaml, BaseGenerator, 16, 4);
                const result = utilYaml.getYamlProperty(file, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[16].indexOf('cloud:')).eql(4);
                expect(lines[16].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
        });
        describe('Add YAML property', () => {
            it('add property at beginin of file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyAtBeginin(file, property, 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const body = BaseGenerator.fs.read(file);
                const lines = body.split('\n');
                expect(lines[0].indexOf('toto:')).eql(0);
                deleteDirTemp(file);
            });
            it('add property at end of file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyAtEnd(file, property, 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[lines.length - 3].indexOf('toto:')).eql(0);
                expect(lines[lines.length - 2].indexOf('cloud:')).not.eql(-1);
                expect(lines[lines.length - 2].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property before another property and his comment', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyBeforeAnotherProperty(file, property, 'stream', BaseGenerator, 'jhipster', true);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[77].indexOf('toto:')).eql(0);
                expect(lines[78].indexOf('cloud:')).not.eql(-1);
                expect(lines[78].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property before another property without his comment', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyBeforeAnotherProperty(file, property, 'stream', BaseGenerator, 'jhipster', false);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[83].indexOf('toto:')).eql(0);
                expect(lines[84].indexOf('cloud:')).not.eql(-1);
                expect(lines[84].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property before another property that don\'t exist', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                expect(() => utilYaml.addYamlPropertyBeforeAnotherProperty(file, property, 'stream', BaseGenerator, 'titi')).to.throw(/not found/);
                deleteDirTemp(file);
            });
            it('add yaml property after another simple property', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyAfterAnotherProperty(file, property, 'stream', BaseGenerator, 'jhipster');
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[127].indexOf('toto:')).eql(0);
                expect(lines[128].indexOf('cloud:')).not.eql(-1);
                expect(lines[128].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property after another property', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyAfterAnotherProperty(file, property, 'stream', BaseGenerator, 'jhipster.logging.logstash');
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[127].indexOf('toto:')).eql(0);
                expect(lines[128].indexOf('cloud:')).not.eql(-1);
                expect(lines[128].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property after another property that don\'t exist', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                expect(() => utilYaml.addYamlPropertyAfterAnotherProperty(file, property, 'stream', BaseGenerator, 'titi')).to.throw(/not found/);
                deleteDirTemp(file);
            });
            it('add yaml property at specific index line with no space', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.addYamlPropertyAtLineIndex(file, property, 'stream', BaseGenerator, 10, 0);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[10].indexOf('toto:')).eql(0);
                expect(lines[11].indexOf('cloud:')).not.eql(-1);
                expect(lines[11].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property at specific index line with space', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'cloud';
                utilYaml.addYamlPropertyAtLineIndex(file, property, 'stream', BaseGenerator, 16, 4);
                const result = utilYaml.getYamlProperty(file, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[16].indexOf('cloud:')).eql(4);
                expect(lines[16].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
        });
        describe('Add YAML property, updateYamlProperty (Intelligent method of adding a property in yaml)', () => {
            it('add a property that don\'t exist in the file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto.cloud';
                utilYaml.updateYamlProperty(file, property, 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[140].indexOf('toto:')).eql(0);
                expect(lines[141].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add a property that exist partially in the file. one levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'spring.cloud';
                utilYaml.updateYamlProperty(file, property, 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[15].indexOf('spring:')).eql(0);
                expect(lines[53].indexOf('cloud:')).not.eql(-1);
                expect(lines[53].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add a property that exist partially in the file two levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'spring.profiles.test';
                utilYaml.updateYamlProperty(file, property, 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.profiles.test', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[15].indexOf('spring:'), 'spring').eql(0);
                expect(lines[16].indexOf('profiles:'), 'profiles').not.eql(-1);
                expect(lines[19].indexOf('test:'), 'test').not.eql(-1);
                expect(lines[19].indexOf('stream'), 'stream').not.eql(-1);
                deleteDirTemp(file);
            });
            it('add a property that exist partially in the file tree levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'jhipster.security.authentication.test';
                utilYaml.updateYamlProperty(file, property, 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'jhipster.security.authentication.test', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[83].indexOf('jhipster:'), 'jhipster').eql(0);
                expect(lines[98].indexOf('security:'), 'security').not.eql(-1);
                expect(lines[99].indexOf('authentication:'), 'authentication').not.eql(-1);
                expect(lines[105].indexOf('test:'), 'test').not.eql(-1);
                expect(lines[105].indexOf('stream'), 'stream').not.eql(-1);
                deleteDirTemp(file);
            });
            it('add yaml property before complex property that is on one line or more (ex hibernate.id.new_generator_mappings)', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                utilYaml.updateYamlProperty(file, 'spring.jpa.properties.hibernate.id.toto', 'stream', BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.jpa.properties.hibernate.id.toto', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[44].indexOf('hibernate:')).eql(12);
                expect(lines[45].indexOf('id:')).eql(16);
                expect(lines[46].indexOf('toto:')).eql(20);
                expect(lines[46].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
        });
        describe('Add YAML properties, updateYamlProperties (Intelligent method of adding properties in yaml)', () => {
            it('add properties that don\'t exist in the file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { toto: { cloud: 'stream' } };
                utilYaml.updateYamlProperties(file, yaml, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'toto.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[140].indexOf('toto:')).eql(0);
                expect(lines[141].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add properties that exist partially in the file. one levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { spring: { cloud: 'stream' } };
                utilYaml.updateYamlProperties(file, yaml, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[15].indexOf('spring:')).eql(0);
                expect(lines[53].indexOf('cloud:')).not.eql(-1);
                expect(lines[53].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
            it('add properties that exist partially in the file two levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { spring: { profiles: { test: 'stream' } } };
                utilYaml.updateYamlProperties(file, yaml, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.profiles.test', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[15].indexOf('spring:'), 'spring').eql(0);
                expect(lines[16].indexOf('profiles:'), 'profiles').not.eql(-1);
                expect(lines[19].indexOf('test:'), 'test').not.eql(-1);
                expect(lines[19].indexOf('stream'), 'stream').not.eql(-1);
                deleteDirTemp(file);
            });
            it('add properties that exist partially in the file tree levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yaml = { jhipster: { security: { authentication: { test: 'stream' } } } };
                utilYaml.updateYamlProperties(file, yaml, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'jhipster.security.authentication.test', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[83].indexOf('jhipster:'), 'jhipster').eql(0);
                expect(lines[98].indexOf('security:'), 'security').not.eql(-1);
                expect(lines[99].indexOf('authentication:'), 'authentication').not.eql(-1);
                expect(lines[105].indexOf('test:'), 'test').not.eql(-1);
                expect(lines[105].indexOf('stream'), 'stream').not.eql(-1);
                deleteDirTemp(file);
            });
            it('add properties that exist partially in the file x levels', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yamlAppDevProperties = { };
                utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.default.contentType', BaseGenerator, 'application/json');
                utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.input.destination', BaseGenerator, 'topic-jhipster');
                utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.output.destination', BaseGenerator, 'topic-jhipster');
                utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.rabbit.bindings.output.producer.routingKeyExpression', BaseGenerator, 'headers.title');
                utilYaml.updateYamlProperties(file, yamlAppDevProperties, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.cloud.stream.bindings.output.destination', BaseGenerator);
                expect(result).eql('topic-jhipster');
                deleteDirTemp(file);
            });
            it('add properties that exist, don\'t duplicate key update the file', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yamlAppDevProperties = { };
                utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.jpa.database-platform', BaseGenerator, 'Test');
                utilYaml.updateYamlProperties(file, yamlAppDevProperties, BaseGenerator);
                expect(() => utilYaml.getYamlProperty(file, 'spring.jpa.database-platform', BaseGenerator)).not.to.throw(/no such file or directory/);
                deleteDirTemp(file);
            });
            it('add properties before complex property that is on one line or more (ex hibernate.id.new_generator_mappings)', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const yamlAppDevProperties = { };
                utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.jpa.properties.hibernate.id.toto', BaseGenerator, 'stream');
                utilYaml.updateYamlProperties(file, yamlAppDevProperties, BaseGenerator);
                const result = utilYaml.getYamlProperty(file, 'spring.jpa.properties.hibernate.id.toto', BaseGenerator);
                expect(result).eql('stream');
                const lines = BaseGenerator.fs.read(file).split('\n');
                expect(lines[44].indexOf('hibernate:')).eql(12);
                expect(lines[45].indexOf('id:')).eql(16);
                expect(lines[46].indexOf('toto:')).eql(20);
                expect(lines[46].indexOf('stream')).not.eql(-1);
                deleteDirTemp(file);
            });
        });
        describe.skip('update YAML properties', () => {
            it('update YAML properties ', () => {

            });
        });
        describe.skip('Delete YAML properties', () => {
            it('delete YAML properties ', () => {

            });
        });
        describe('functions', () => {
            it('getPathAndValueOfAllProperty ', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const object = jsyaml.safeLoad(BaseGenerator.fs.read(file));
                const arrayRetur = [];
                utilYaml.getPathAndValueOfAllProperty(object, '', arrayRetur, BaseGenerator);
                //  BaseGenerator.log(arrayRetur);
                expect(arrayRetur.length).eql(54);
                deleteDirTemp(file);
            });
            it('getLastPropertyCommonHierarchy ', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'spring';
                const propExist = utilYaml.getLastPropertyCommonHierarchy(file, property, BaseGenerator);
                expect(propExist).eql('spring');
                deleteDirTemp(file);
            });
            it('getLastPropertyCommonHierarchy ', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'spring.profiles';
                const propExist = utilYaml.getLastPropertyCommonHierarchy(file, property, BaseGenerator);
                expect(propExist).eql('spring.profiles');
                deleteDirTemp(file);
            });
            it('getLastPropertyCommonHierarchy ', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'spring.profiles.test';
                const propExist = utilYaml.getLastPropertyCommonHierarchy(file, property, BaseGenerator);
                expect(propExist).eql('spring.profiles');
                deleteDirTemp(file);
            });
            it('getLastPropertyCommonHierarchy ', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'spring.profiles.active';
                const propExist = utilYaml.getLastPropertyCommonHierarchy(file, property, BaseGenerator);
                expect(propExist).eql('spring.profiles.active');
                deleteDirTemp(file);
            });
            it('getLastPropertyCommonHierarchy ', () => {
                const file = copyYamlTemp('../test/templates/utils/application-dev.yml', 'application-dev.yml');
                const property = 'toto';
                const propExist = utilYaml.getLastPropertyCommonHierarchy(file, property, BaseGenerator);
                expect(propExist).to.be.undefined();
                deleteDirTemp(file);
            });
        });
    });
});
